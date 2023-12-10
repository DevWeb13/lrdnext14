'use server';

import bcrypt from 'bcrypt';

import { redirect } from 'next/navigation';

import { SignUpFormSchema } from '@/schema/user-form-schema';
import { addEmailVerificationToken } from './add-email-verification-token';
import { connectToCollection } from '@/app/utils/connect-db';
import { sendVerificationEmail } from '@/app/lib/actions/signup/send-verification-email';

import type { AppUser, NewAppUser } from '@/types/app-user';
import type { FormErrorState } from '@/types/form-error-state';
import type { SignUpData } from '@/types/sign-up-data';

async function checkSignupFormData(
  signUpData: SignUpData,
  existingUser: AppUser | null
): Promise<FormErrorState> {
  // Valider les données du formulaire avec le schéma Zod étendu
  const validatedUser = SignUpFormSchema.safeParse(signUpData);

  // Si la validation échoue, retourner les erreurs
  if (!validatedUser.success) {
    return {
      errors: validatedUser.error.flatten().fieldErrors,
      message: 'Veuillez vérifier vos saisies.',
    };
  }

  const { password, confirmPassword } = validatedUser.data;

  // Vérifier si les mots de passe correspondent
  if (password !== confirmPassword) {
    return {
      errors: { confirmPassword: ['Les mots de passe ne correspondent pas.'] },
      message: 'Veuillez vérifier vos saisies.',
    };
  }

  if (existingUser && existingUser.password !== null) {
    return {
      errors: { email: ['Cet e-mail est déjà utilisé par un autre compte.'] },
      message: 'Veuillez vérifier vos saisies.',
    };
  }

  // reinit errors et message
  return {
    errors: {},
    message: null,
  };
}

export async function signupSubmit(
  prevState: FormErrorState,
  formData: FormData
): Promise<FormErrorState> {
  const { collection, client } = await connectToCollection('users');
  const signUpData = {
    name: formData.get('name')?.toString(),
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
    confirmPassword: formData.get('confirmPassword')?.toString(),
  };
  const { name, email, password, confirmPassword } = signUpData;
  const existingUser = await collection.findOne({ email });

  console.log({ name, email, password, confirmPassword });
  prevState = await checkSignupFormData(signUpData, existingUser);

  if (prevState.message) {
    return prevState;
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password!, 10);

  if (existingUser) {
    // ajouter le token de confirmation et la date d'expiration
    const { emailVerificationToken, emailVerificationTokenExpiredAt } =
      await addEmailVerificationToken(existingUser._id.toString(), collection);

    // envoie un mail de confirmation avec id, token, email, name, hashedPassword, et date d'expiration
    prevState = await sendVerificationEmail({
      userName: name!,
      id: existingUser._id.toString(),
      email: email!,
      hashedPassword,
      emailVerificationToken,
      emailVerificationTokenExpiredAt,
    });

    if (prevState.message) {
      return prevState;
    }

    client.close();
    // redirection vers la page de checked-email
    redirect('/auth/checked-email');
  }

  // Si l'utilisateur n'existe pas, créer un nouvel utilisateur
  const newUser: NewAppUser = {
    role: 'user',
    status: 'pendingVerification',
    name: name!,
    email: email!,
    image: null,
    password: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerificationToken: null,
    emailVerificationTokenExpiredAt: null,
    resetPasswordToken: null,
    resetPasswordTokenExpiredAt: null,
  };

  // Ajouter le nouvel utilisateur à la base de données et récupérer son id

  const { insertedId } = await collection.insertOne(newUser);

  // ajouter le token de confirmation et la date d'expiration
  const { emailVerificationToken, emailVerificationTokenExpiredAt } =
    await addEmailVerificationToken(insertedId.toString(), collection);

  // envoie un mail de confirmation avec id, token, email, name, hashedPassword, et date d'expiration
  prevState = await sendVerificationEmail({
    userName: name!,
    id: insertedId.toString(),
    email: email!,
    hashedPassword,
    emailVerificationToken,
    emailVerificationTokenExpiredAt,
  });

  if (prevState.message) {
    return prevState;
  }

  // Fermer la connexion à la base de données

  client.close();
  prevState.message = null;
  // redirection vers la page de checked-email
  redirect('/auth/checked-email');
}
