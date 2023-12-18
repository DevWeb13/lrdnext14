// app/lib/actions/get/get-email-valid-user-info.ts

'use server';

import connect from '@/app/utils/connect-db';
import User from '@/models/User';
import { ObjectId } from 'mongodb';

/**
 * The function getEmailValidUserInfo checks if a user's email verification token is valid or expired.
 * @param {string} id - The `id` parameter is a string that represents the user's ID. It is used to
 * search for the user in the database.
 * @param {string} token - The `token` parameter is a string that represents the email verification
 * token. This token is used to verify the user's email address and ensure that the user is the
 * rightful owner of the email address associated with the account.
 * @returns a Promise that resolves to a string. The possible return values are:
 * - "alreadyValid" if the user is already validated or if the user is not found in the database.
 * - "validToken" if the email verification token is valid.
 * - "invalidToken" if the email verification token is expired or invalid.
 */
export async function getEmailValidUserInfo(
  id: string,
  token: string,
): Promise<string> {
  try {
    await connect();

    // Rechercher l'utilisateur par id
    // Convertir la chaîne id en ObjectId
    const objectId = new ObjectId(id);

    const user = await User.findOne({ _id: objectId });
    // Retourner les informations de l'utilisateur (ou null si non trouvé)
    console.log({ user });
    if (!user || user.status === 'active') {
      return 'alreadyValid';
    }

    let tokenExpired;
    if (user.emailVerificationTokenExpiredAt) {
      tokenExpired = user.emailVerificationTokenExpiredAt < new Date();
    } else {
      tokenExpired = true;
    }
    if (!tokenExpired && user.emailVerificationToken === token) {
      return 'validToken';
    }

    // Le token a expiré ou est invalide
    await User.updateOne(
      { _id: objectId },
      {
        $set: {
          emailVerificationToken: null,
          emailVerificationTokenExpiredAt: null,
        },
      },
    );

    return 'invalidToken';
  } catch (error) {
    console.error('Failed to connect database ', error);
    throw new Error('Failet to connect database.');
  }
}
