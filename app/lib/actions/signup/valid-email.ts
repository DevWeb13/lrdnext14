'use server';

import connect from '@/app/utils/connect-db';
import User from '@/models/User';
import { FormErrorState } from '@/types/form-error-state';
import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';

/**
 * The function updates an existing user's password and email verification token in a MongoDB
 * collection.
 * @param {null | string} prevState - The `prevState` parameter is the previous state of the email
 * field. It can be either `null` or a string representing the previous email value.
 * @param {FormData} formData - The `formData` parameter is an object that contains the data submitted
 * in a form. It is of type `FormData`, which is a built-in JavaScript class for handling form data.
 * @returns a Promise that resolves to a boolean value.
 */
export async function validEmail(
  prevState: FormErrorState,
  formData: FormData,
): Promise<FormErrorState> {
  const id = formData.get('id');
  const objectId = new ObjectId(id as string);

  // Mettre à jour l'utilisateur existant avec le nouveau mot de passe
  try {
    await connect();

    await User.updateOne(
      { _id: objectId },
      {
        $set: {
          emailVerificationToken: null,
          emailVerificationTokenExpiredAt: null,
          status: 'active',
        },
      },
    );

    prevState.message = null;
  } catch (error) {
    return {
      errors: {},
      message:
        "Erreur lors de la validation de l'email : veuillez réessayer plus tard.",
    };
  }
  redirect('/auth/confirm-valid-email');
}
