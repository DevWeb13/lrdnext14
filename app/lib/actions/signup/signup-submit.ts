'use server';

import bcrypt from 'bcrypt';

import { redirect } from 'next/navigation';

import { SignUpFormSchema } from '@/schema/zod/user-form-schema';
import { addPasswordAndEmailVerificationToken } from './add-password-and-email-verification-token';
import connect from '@/app/utils/connect-db';
import { sendVerificationEmail } from '@/app/lib/actions/signup/send-verification-email';

import User from '@/models/User';

import type { AppUser, NewAppUser } from '@/types/app-user';
import type { FormErrorState } from '@/types/form-error-state';
import type { SignUpData } from '@/types/sign-up-data';
import { generateEmailVerificationToken } from '@/app/utils/generate-email-verification-token';

async function checkSignupFormData(
  signUpData: SignUpData,
  existingUser: AppUser | null,
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

  if (existingUser?.password) {
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
  formData: FormData,
): Promise<FormErrorState> {
  const signUpData = {
    name: formData.get('name')?.toString(),
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
    confirmPassword: formData.get('confirmPassword')?.toString(),
  };
  const { name, email, password, confirmPassword } = signUpData;
  console.log({ name, email, password, confirmPassword });
  try {
    await connect();
    const existingUser = await User.findOne({ email });
    console.log({ existingUser });

    const checkSignupFormDataState = await checkSignupFormData(
      signUpData,
      existingUser,
    );
    console.log({ checkSignupFormDataState });

    if (checkSignupFormDataState.message) {
      return checkSignupFormDataState;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password!, 10);
    console.log({ hashedPassword });

    if (existingUser) {
      console.log('test');
      // ajouter le token de confirmation et la date d'expiration
      const { emailVerificationToken, emailVerificationTokenExpiredAt } =
        await addPasswordAndEmailVerificationToken(
          existingUser._id.toString(),
          hashedPassword,
          User,
        );

      // envoie un mail de confirmation avec id, token, email, name,  et date d'expiration
      const sendVerificationEmailState = await sendVerificationEmail({
        name: name!,
        id: existingUser._id.toString(),
        email: email!,
        emailVerificationToken,
        emailVerificationTokenExpiredAt,
      });

      if (sendVerificationEmailState.message) {
        return sendVerificationEmailState;
      }
    } else {
      // Si l'utilisateur n'existe pas, créer un nouvel utilisateur
      console.log('test 2');
      const { emailVerificationToken, emailVerificationTokenExpiredAt } =
        generateEmailVerificationToken();
      const newUser: NewAppUser = new User({
        role: 'user',
        status: 'pendingVerification',
        name: name!,
        email: email!,
        image: null,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerificationToken,
        emailVerificationTokenExpiredAt,
        resetPasswordToken: null,
        resetPasswordTokenExpiredAt: null,
      });

      // Ajouter le nouvel utilisateur à la base de données et récupérer son id

      const createdUser = await User.create(newUser);

      // envoie un mail de confirmation avec id, token, email, name,  et date d'expiration
      const sendVerificationEmailState = await sendVerificationEmail({
        name: name!,
        id: createdUser._id.toString(),
        email: email!,
        emailVerificationToken,
        emailVerificationTokenExpiredAt,
      });
      console.log({ sendVerificationEmailState });

      if (sendVerificationEmailState.message) {
        return sendVerificationEmailState;
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return {
      errors: {},
      message:
        'Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.',
    };
  }
  redirect('/auth/checked-email');
}
