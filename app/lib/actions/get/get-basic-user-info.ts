// app/lib/actions/get/get-basic-user-info.ts

'use server';

import { BasicAppUserInfo } from '@/types/app-user';
import connect from '@/app/utils/connect-db';
import User from '@/models/User';

/**
 * The function `getBasicUserInfo` retrieves basic user information from a MongoDB collection based on
 * the provided email.
 * @param {string} email - The email parameter is a string that represents the email address of the
 * user you want to retrieve information for.
 * @returns The function `getBasicUserInfo` returns a `Promise` that resolves to either a
 * `BasicUserInfo` object or `null`.
 */
export async function getBasicUserInfo(
  email: string
): Promise<BasicAppUserInfo | null> {
  try {
    await connect();

    // Rechercher l'utilisateur par email

    const user = await User.findOne({ email });
    // Retourner les informations de l'utilisateur (ou null si non trouvé)

    if (user) {
      // Transformez l'objet user en un objet simple
      const simpleUser = {
        id: user._id.toString(), // Convertir l'ObjectId en string
        password: user.password,
        name: user.name,
        email: user.email,
      };

      return simpleUser;
    }
    return null;
  } catch (error) {
    console.error('Erreur de connexion à la base de données', error);
    throw new Error('Erreur de connexion à la base de données');
  }
}
