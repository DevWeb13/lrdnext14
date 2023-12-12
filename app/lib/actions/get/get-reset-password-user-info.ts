'use server';

import connect from '@/app/utils/connect-db';
import { ObjectId } from 'mongodb';
import { ResetPasswordAppUserInfo } from '@/types/app-user';
import User from '@/models/User';

/**
 * The function `getResetPasswordUserInfo` retrieves the reset password information for a user based on
 * their ID and token.
 * @param {string} id - The `id` parameter is a string that represents the user's ID. It is used to
 * search for the user in the database.
 * @param {string} token - The `token` parameter is a string that represents the reset password token.
 * This token is generated when a user requests to reset their password and is sent to their email
 * address. The token is used to verify the user's identity and allow them to reset their password.
 * @returns a Promise that resolves to either a ResetPasswordUserInfo object or null.
 */
export async function getResetPasswordUserInfo(
  id: string,
  token: string
): Promise<ResetPasswordAppUserInfo | null> {
  try {
    await connect();

    // Rechercher l'utilisateur par id
    // Convertir la chaîne id en ObjectId
    const objectId = new ObjectId(id);

    const user = await User.findOne({ _id: objectId });
    // Retourner les informations de l'utilisateur (ou null si non trouvé)
    if (!user) {
      // L'utilisateur n'existe pas

      return null;
    }

    if (!user.resetPasswordTokenExpiredAt) {
      return null;
    }
    const tokenExpired = user.resetPasswordTokenExpiredAt < new Date();
    if (!tokenExpired && user.resetPasswordToken === token) {
      // Le token est valide et n'a pas expiré
      const simpleUser = {
        id: id, // Convertir l'ObjectId en string
        resetPasswordToken: user.resetPasswordToken,
        resetPasswordTokenExpiredAt: user.resetPasswordTokenExpiredAt,
      };

      return simpleUser;
    }

    // Le token a expiré ou est invalide
    await User.updateOne(
      { _id: objectId },
      {
        $set: { resetPasswordToken: null, resetPasswordTokenExpiredAt: null },
      }
    );

    return null;
  } catch (error) {
    console.error('Failed to connect database ', error);
    throw new Error('Failet to connect database.');
  }
}
