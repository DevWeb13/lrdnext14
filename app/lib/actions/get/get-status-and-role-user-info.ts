'use server';

import connect from '@/app/utils/connect-db';
import User from '@/models/User';
import { AppUser } from '@/types/app-user';
import { ObjectId } from 'mongodb';

/**
 * The function `getStatusAndRoleUserInfo` retrieves the role and status information of a user from a
 * MongoDB collection based on their ID.
 * @param {string} id - The `id` parameter is a string representing the unique identifier of a user.
 * @returns The function `getStatusAndRoleUserInfo` returns a Promise that resolves to an object with
 * the properties `role` and `status` of a user, or `null` if the user is not found.
 */
export async function getStatusAndRoleUserInfo(id: string): Promise<{
  role: AppUser['role'];
  status: AppUser['status'];
} | null> {
  try {
    await connect();

    // Rechercher l'utilisateur par id
    // Convertir la chaîne id en ObjectId
    const objectId = new ObjectId(id);

    const user = await User.findOne({ _id: objectId });
    // Retourner les informations de l'utilisateur (ou null si non trouvé)
    // console.log({ user });
    if (!user) {
      // L'utilisateur n'existe pas
      return null;
    }

    const { role, status } = user;

    return {
      role,
      status,
    };
  } catch (error) {
    console.error('Failed to connect database ', error);
    throw new Error('Failed to connect database.');
  }
}
