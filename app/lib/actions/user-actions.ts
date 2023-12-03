'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
import connect from '../../utils/connect-db';

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
  const user = await collection.findOne({ email: email });
  if (user) {
    return {
      errors: { email: ['Cet e-mail est déjà utilisé par un autre compte.'] },
      message: 'Veuillez vérifier vos saisies.',
    };
  }

  // Hacher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Créer l'utilisateur
  const newUser = {
    name,
    email,
    password: hashedPassword,
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
    if ((error as Error).message.includes('CredentialsSignin')) {
      return 'Données incorrectes.';
    }
    throw error;
  }
}
