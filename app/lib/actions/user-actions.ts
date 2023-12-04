'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

import bcrypt from 'bcrypt';
import connect from '../../utils/connect-db';
import { ObjectId } from 'mongodb';

export type UserState = {
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
  _id: z.string(),
  name: z
    .string()
    .min(1, 'Le nom est requis.')
    .min(3, 'Le nom doit comporter au moins 3 caractères.')
    .regex(/^[A-Za-z]+$/, 'Le nom ne doit contenir que des lettres.'),
  email: z.string().email("L'e-mail doit être valide."),
  password: z
    .string()
    .min(6, 'Le mot de passe doit comporter au moins 6 caractères.'),
});

// Schéma pour la création d'un utilisateur, en omettant 'id' et en ajoutant 'confirmPassword'
const CreateUser = UserSchema.omit({ _id: true }).extend({
  confirmPassword: z
    .string()
    .min(6, 'Le mot de passe doit comporter au moins 6 caractères.'),
});

export async function deleteUser(prevState: null, id: string) {
  const client = await connect();
  const db = client.db('LaReponseDev');
  const collection = db.collection('users');

  try {
    // Convertir la chaîne id en ObjectId
    const objectId = new ObjectId(id);
    console.log({ objectId });

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
  prevState: UserState,
  formData: FormData
): Promise<UserState> {
  // Valider les données du formulaire avec le schéma Zod étendu
  const validatedUser = CreateUser.safeParse({
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
  const client = await connect();
  const db = client.db('LaReponseDev');
  const collection = db.collection('users');
  const existingUser = await collection.findOne({ email: email });
  if (existingUser) {
    // Si l'utilisateur existe et a un mot de passe null (inscrit via Google)
    if (existingUser.password === null) {
      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Mettre à jour l'utilisateur existant avec le nouveau mot de passe
      await collection.updateOne(
        { _id: existingUser._id },
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

  // Générer une image basée sur les initiales du nom
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('');
  const image = `https://some-image-service.com/${initials}`; // Utilisez un service ou une méthode pour générer l'image

  // Créer l'utilisateur
  const newUser = {
    name,
    email,
    password: hashedPassword,
    image,
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
