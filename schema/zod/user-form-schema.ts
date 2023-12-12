import { z } from 'zod';
// Définir le schéma de base de l'utilisateur
export const UserFormSchema = z.object({
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

export const SignUpFormSchema = UserFormSchema.omit({
  id: true,
});

export const EmailResetPassword = UserFormSchema.omit({
  id: true,
  name: true,
  password: true,
  confirmPassword: true,
});

export const ResetPasswordUser = UserFormSchema.omit({
  name: true,
  email: true,
});
