'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';

// export type UserState = {
//   errors?: {
//     name?: string[];
//     email?: string[];
//     password?: string[];
//     confirmPassword?: string[];
//   };
//   message?: string | null;
// };

// // Définir le schéma de base de l'utilisateur
// const UserSchema = z.object({
//   _id: z.string(),
//   name: z
//     .string()
//     .min(1, 'Le nom est requis.')
//     .min(3, 'Le nom doit comporter au moins 3 caractères.')
//     .regex(/^[A-Za-z]+$/, 'Le nom ne doit contenir que des lettres.'),
//   email: z.string().email("L'e-mail doit être valide."),
//   password: z
//     .string()
//     .min(6, 'Le mot de passe doit comporter au moins 6 caractères.'),
//   image: z.string().url("L'URL de l'image doit être valide.").default(''),
// });

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData);
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
