// app/lib/actions/account-settings/reset-password.ts

'use server';

import connect from '@/app/utils/connect-db';
import User from '@/models/User';
import { ResetPasswordUser } from '@/schema/zod/user-form-schema';
import { FormErrorState } from '@/types/form-error-state';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';

/**
 * The `resetPassword` function is used to validate and update a user's password, and then redirect
 * them to a confirmation page.
 * @param {FormErrorState} prevState - The `prevState` parameter is the previous state of the form,
 * which includes any error messages that were previously displayed. It is of type `FormErrorState`.
 * @param {FormData} formData - The `formData` parameter is an object that contains the data submitted
 * in the password reset form. It is expected to have the following properties:
 * @returns a Promise that resolves to either a FormErrorState object or void.
 */
export async function resetPassword(
  prevState: FormErrorState,
  formData: FormData,
): Promise<FormErrorState> {
  // Modification pour permettre un retour void
  try {
    // Valider les données du formulaire
    const validatedUser = ResetPasswordUser.safeParse({
      id: formData.get('id'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (!validatedUser.success) {
      return {
        errors: validatedUser.error.flatten().fieldErrors,
        message: 'Veuillez vérifier vos saisies.',
      };
    }

    const { id, password, confirmPassword } = validatedUser.data;

    if (password !== confirmPassword) {
      return {
        errors: {
          confirmPassword: ['Les mots de passe ne correspondent pas.'],
        },
        message: 'Veuillez vérifier vos saisies.',
      };
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mettre à jour l'utilisateur
    await connect();
    await User.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordTokenExpiredAt: null,
        },
      },
    );
  } catch (error) {
    console.error(
      'Erreur lors de la réinitialisation du mot de passe :',
      error,
    );
    return {
      errors: {},
      message:
        'Une erreur est survenue lors de la réinitialisation de votre mot de passe. Veuillez réessayer.',
    };
  }
  // Redirection
  redirect('/auth/confirm-reset-password');
}
