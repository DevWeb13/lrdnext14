'use server';

import connect from '@/app/utils/connect-db';
import User from '@/models/User';
import { AppUser } from '@/types/app-user';

/**
 * The function `getStatusAndRoleUserInfo` retrieves the role and status information of a user from a
 * MongoDB collection based on their ID.
 * @param {string} id - The `id` parameter is a string representing the unique identifier of a user.
 * @returns The function `getStatusAndRoleUserInfo` returns a Promise that resolves to an object with
 * the properties `role` and `status` of a user, or `null` if the user is not found.
 */
export async function getStatus(email: string): Promise<
  | {
      status: AppUser['status'];
    }
  | null
  | string
> {
  try {
    await connect();

    const user = await User.findOne({ email });
    // Retourner les informations de l'utilisateur (ou null si non trouvé)
    // console.log({ user });
    if (!user) {
      // L'utilisateur n'existe pas
      return null;
    }

    const { status } = user;

    return {
      status,
    };
  } catch (error) {
    console.error('Failed to connect database ', error);
    return 'Probleme de connexion à la base de données, veuillez réessayer plus tard.';
  }
}
