// app/lib/actions/account-settings/delete-user.ts

'use server';

import connect from '@/app/utils/connect-db';
import { ObjectId } from 'mongodb';
import { signOut } from '@/auth';
import User from '@/models/User';

export async function deleteUser(
  prevState: string | undefined,
  formData: FormData
) {
  await connect();

  // Récupérer l'id de l'utilisateur
  const id = formData.get('id') as string;

  try {
    // Convertir la chaîne id en ObjectId
    const objectId = new ObjectId(id);

    // Supprimer l'utilisateur de la base de données
    await User.deleteOne({ _id: objectId });

    // Déconnecter l'utilisateur
    try {
      await signOut({ redirectTo: '/' });
    } catch (err) {
      console.error('Error signing out user:', err);
      return "Échec de la suppression de l'utilisateur";
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return "Échec de la suppression de l'utilisateur";
  }
}
