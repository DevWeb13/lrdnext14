'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

import bcrypt from 'bcrypt';
import connect from '../../utils/connect-db';
import { Collection, ObjectId } from 'mongodb';
import { Resend } from 'resend';
import { DropboxResetPasswordEmail } from '@/components/email-template';
import { generateResetPasswordToken } from '@/app/utils/generate-reset-password-token';
import { renderAsync } from '@react-email/render';

const MODE = process.env.NODE_ENV;

import type {
  BasicUserInfo,
  ResetPasswordUserInfo,
  NewUser,
} from '@/app/lib/definitions';

export type FormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
};

// Définir le schéma de base de l'utilisateur
const UserSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, 'Le nom est requis.')
    .min(3, 'Le nom doit comporter au moins 3 caractères.')
    .regex(/^[A-Za-z]+$/, 'Le nom ne doit contenir que des lettres.'),
  email: z.string().email("L'e-mail doit être valide."),
  password: z
    .string()
    .min(6, 'Le mot de passe doit comporter au moins 6 caractères.'),
  confirmPassword: z
    .string()
    .min(6, 'Le mot de passe doit comporter au moins 6 caractères.'),
});

const createUserSchema = UserSchema.omit({
  id: true,
});

const EmailResetPassword = UserSchema.omit({
  id: true,
  name: true,
  password: true,
  confirmPassword: true,
});

const ResetPasswordUser = UserSchema.omit({
  name: true,
  email: true,
});

export async function addResetToken(email: string, users: Collection) {
  const { resetPasswordToken, resetPasswordTokenExpiredAt } =
    generateResetPasswordToken();

  await users.updateOne(
    { email },
    { $set: { resetPasswordToken, resetPasswordTokenExpiredAt } }
  );

  return resetPasswordToken;
}

export async function sendEmailResetPassword(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Valider les données du formulaire avec le schéma Zod étendu
  const validatedUser = EmailResetPassword.safeParse({
    email: formData.get('email'),
  });

  // Si la validation échoue, retourner les erreurs
  if (!validatedUser.success) {
    return {
      errors: validatedUser.error.flatten().fieldErrors,
      message: 'Veuillez vérifier vos saisies.',
    };
  }

  const { email } = validatedUser.data;

  // Vérifier si l'utilisateur existe déjà
  // Utiliser la fonction connect pour obtenir le client MongoDB
  const client = await connect();

  // Accéder à la base de données et à la collection 'users'
  const db = client.db();
  const collection = db.collection('users');
  const user = await collection.findOne({ email });
  if (!user) {
    return {
      errors: { email: ["Cet e-mail n'est pas associé à un compte."] },
      message: 'Veuillez vérifier vos saisies.',
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const resetPasswordToken = await addResetToken(user.email, collection);

  const URL =
    MODE === 'production'
      ? 'https://lrdnext14.vercel.app'
      : 'http://localhost:3000';

  const html = await renderAsync(
    DropboxResetPasswordEmail({
      resetPasswordLink: `${URL}/auth/reset-password/${user._id}?token=${resetPasswordToken}&email=${user.email}`,
      userFirstname: user.name,
    }) as React.ReactElement
  );

  try {
    await resend.emails.send({
      from: 'contact@lareponsedev.com',
      to: user.email,
      subject: 'Réinitialisation du mot de passe',
      html,
    });
  } catch (error) {
    console.error(error);
    return {
      message: "Erreur d'envoi de l'email : veuillez réessayer plus tard.",
    };
  }

  // Fermer la connexion à la base de données et rediriger
  client.close();
  prevState.message = null;
  // Pas d'erreur, redirection vers login
  redirect('/auth/login');
}

export async function resetPasswordUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Valider les données du formulaire avec le schéma Zod étendu
  const validatedUser = ResetPasswordUser.safeParse({
    id: formData.get('id'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  // Si la validation échoue, retourner les erreurs
  if (!validatedUser.success) {
    return {
      errors: validatedUser.error.flatten().fieldErrors,
      message: 'Veuillez vérifier vos saisies.',
    };
  }

  const { id, password, confirmPassword } = validatedUser.data;

  // Vérifier si les mots de passe correspondent
  if (password !== confirmPassword) {
    return {
      errors: { confirmPassword: ['Les mots de passe ne correspondent pas.'] },
      message: 'Veuillez vérifier vos saisies.',
    };
  }

  // Hacher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Mettre à jour l'utilisateur existant avec le nouveau mot de passe
  const client = await connect();
  const db = client.db('LaReponseDev');
  const collection = db.collection('users');
  await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiredAt: null,
      },
    }
  );

  // Fermer la connexion à la base de données et rediriger
  client.close();
  prevState.message = null; // Pas d'erreur, redirection vers login
  redirect('/auth/login');
}

export async function deleteUser(prevState: null, id: string) {
  const client = await connect();
  const db = client.db('LaReponseDev');
  const collection = db.collection('users');

  try {
    // Convertir la chaîne id en ObjectId
    const objectId = new ObjectId(id);

    // Supprimer l'utilisateur de la base de données
    await collection.deleteOne({ _id: objectId });
  } catch (error) {
    console.error('Error deleting user:', error);
    // Gérer l'erreur si nécessaire
  } finally {
    // Fermer la connexion à la base de données dans tous les cas
    client.close();
  }

  // Déconnecter l'utilisateur
  await signOut({ redirectTo: '/' });
}

export async function createUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Valider les données du formulaire avec le schéma Zod étendu
  const validatedUser = createUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  // Si la validation échoue, retourner les erreurs
  if (!validatedUser.success) {
    return {
      errors: validatedUser.error.flatten().fieldErrors,
      message: 'Veuillez vérifier vos saisies.',
    };
  }

  const { name, email, password, confirmPassword } = validatedUser.data;

  // Vérifier si les mots de passe correspondent
  if (password !== confirmPassword) {
    return {
      errors: { confirmPassword: ['Les mots de passe ne correspondent pas.'] },
      message: 'Veuillez vérifier vos saisies.',
    };
  }

  // Vérifier si l'utilisateur existe déjà
  // Utiliser la fonction connect pour obtenir le client MongoDB
  const client = await connect();

  // Accéder à la base de données et à la collection 'users'
  const db = client.db();
  const collection = db.collection('users');
  const user = await collection.findOne({ email });
  if (user) {
    // Si l'utilisateur existe et a un mot de passe null (inscrit via Google)
    if (user.password === null) {
      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Mettre à jour l'utilisateur existant avec le nouveau mot de passe
      await collection.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );

      // Fermer la connexion à la base de données et rediriger
      client.close();
      prevState.message = null; // Pas d'erreur, redirection vers login
      redirect('/auth/login');
    } else {
      // Si l'utilisateur existe avec un mot de passe, retourner une erreur
      return {
        errors: { email: ['Cet e-mail est déjà utilisé par un autre compte.'] },
        message: 'Veuillez vérifier vos saisies.',
      };
    }
  }

  // Hacher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Créer l'utilisateur
  const newUser: NewUser = {
    name,
    role: 'user',
    status: 'pendingVerification',
    email,
    password: hashedPassword,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerificationToken: null,
    emailVerificationTokenExpiredAt: null,
    resetPasswordToken: null,
    resetPasswordTokenExpiredAt: null,
  };

  // Insérer l'utilisateur dans la base de données
  try {
    await collection.insertOne(newUser);
  } catch (error) {
    return {
      message: 'Erreur de base de données : inscription impossible.',
    };
  }

  // Fermer la connexion à la base de données
  client.close();

  // Revalider le cache pour la page d'utilisateur et rediriger l'utilisateur
  revalidatePath('/dashboard');
  redirect('/auth/login');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', Object.fromEntries(formData));
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function getBasicUserInfo(
  email: string
): Promise<BasicUserInfo | null> {
  try {
    // Utiliser la fonction connect pour obtenir le client MongoDB
    const client = await connect();

    // Accéder à la base de données et à la collection 'users'
    const db = client.db();
    const collection = db.collection('users');

    // Rechercher l'utilisateur par email

    const user = await collection.findOne({ email });
    // Retourner les informations de l'utilisateur (ou null si non trouvé)

    if (user) {
      // Transformez l'objet user en un objet simple
      const simpleUser = {
        id: user._id.toString(), // Convertir l'ObjectId en string
        password: user.password,
        name: user.name,
        email: user.email,
      };
      client.close();

      return simpleUser;
    }
    return null;
  } catch (error) {
    console.error('Failed to connect database ', error);
    throw new Error('Failet to connect database.');
  }
}

export async function getResetPasswordUserInfo(
  id: string,
  token: string
): Promise<ResetPasswordUserInfo | null> {
  try {
    // Utiliser la fonction connect pour obtenir le client MongoDB
    const client = await connect();

    // Accéder à la base de données et à la collection 'users'
    const db = client.db();
    const collection = db.collection('users');

    // Rechercher l'utilisateur par id
    // Convertir la chaîne id en ObjectId
    const objectId = new ObjectId(id);

    const user = await collection.findOne({ _id: objectId });
    // Retourner les informations de l'utilisateur (ou null si non trouvé)
    console.log({ user });
    if (!user) {
      // L'utilisateur n'existe pas
      client.close();
      return null;
    }

    const tokenExpired = user.resetPasswordTokenExpiredAt < new Date();
    if (!tokenExpired && user.resetPasswordToken === token) {
      // Le token est valide et n'a pas expiré
      const simpleUser = {
        id: user._id.toString(), // Convertir l'ObjectId en string
        resetPasswordToken: user.resetPasswordToken,
        resetPasswordTokenExpiredAt: user.resetPasswordTokenExpiredAt,
      };
      client.close();
      return simpleUser;
    }

    // Le token a expiré ou est invalide
    await collection.updateOne(
      { _id: objectId },
      {
        $set: { resetPasswordToken: null, resetPasswordTokenExpiredAt: null },
      }
    );
    client.close();

    return null;
  } catch (error) {
    console.error('Failed to connect database ', error);
    throw new Error('Failet to connect database.');
  }
}
