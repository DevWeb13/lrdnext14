'use server';

import { connectToCollection } from '@/app/utils/connect-db';
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
    // Utiliser la fonction connect pour obtenir le client MongoDB
    const { client, collection } = await connectToCollection('users');

    // Rechercher l'utilisateur par id
    // Convertir la chaîne id en ObjectId
    const objectId = new ObjectId(id);

    const user = await collection.findOne({ _id: objectId });
    // Retourner les informations de l'utilisateur (ou null si non trouvé)
    // console.log({ user });
    if (!user) {
      // L'utilisateur n'existe pas
      client.close();
      console.log('You deconnected to MongoDb');
      return null;
    }

    const { role, status } = user;

    client.close();
    console.log('You deconnected to MongoDb');
    return {
      role,
      status,
    };
  } catch (error) {
    console.error('Failed to connect database ', error);
    throw new Error('Failet to connect database.');
  }
}
