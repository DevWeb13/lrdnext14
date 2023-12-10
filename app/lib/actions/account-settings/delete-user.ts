'use server';

import { connectToCollection } from '@/app/utils/connect-db';
import { ObjectId } from 'mongodb';
import { signOut } from '@/auth';

export async function deleteUser(prevState: null, id: string) {
  const { client, collection } = await connectToCollection('users');

  try {
    // Convertir la chaîne id en ObjectId
    const objectId = new ObjectId(id);

    // Supprimer l'utilisateur de la base de données
    await collection.deleteOne({ _id: objectId });
  } catch (error) {
    console.error('Error deleting user:', error);
    // Gérer l'erreur si nécessaire
  } finally {
    // Fermer la connexion à la base de données dans tous les cas
    client.close();
    console.log('You deconnected to MongoDb');
  }

  // Déconnecter l'utilisateur
  await signOut({ redirectTo: '/' });
}
