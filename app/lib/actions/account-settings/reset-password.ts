'use server';

import { connectToCollection } from '@/app/utils/connect-db';
import { ResetPasswordUser } from '@/schema/user-form-schema';
import { FormErrorState } from '@/types/form-error-state';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';

/**
 * The `resetPassword` function is used to validate and update a user's password in a MongoDB database.
 * @param {FormErrorState} prevState - The `prevState` parameter is the previous state of the form,
 * which includes any errors and a message. It is of type `FormErrorState`.
 * @param {FormData} formData - The `formData` parameter is an object that contains the data submitted
 * in the reset password form. It is of type `FormData`, which is a built-in JavaScript class used to
 * handle form data.
 * @returns a Promise that resolves to a FormErrorState object.
 */
export async function resetPassword(
  prevState: FormErrorState,
  formData: FormData
): Promise<FormErrorState> {
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
  const { client, collection } = await connectToCollection('users');
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
  console.log('You deconnected to MongoDb');
  prevState.message = null; // Pas d'erreur, redirection vers login
  redirect('/auth/confirm-reset-password');
}
