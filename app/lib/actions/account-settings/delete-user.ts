// app/lib/actions/account-settings/delete-user.ts

'use server';

import connect from '@/app/utils/connect-db';
import { ObjectId } from 'mongodb';
import { auth, signOut } from '@/auth';
import User from '@/models/User';

export async function deleteUser() {
  await connect();

  const session = await auth();
  const id = session?.user?.id;

  try {
    // Convertir la chaîne id en ObjectId
    const objectId = new ObjectId(id);

    // Supprimer l'utilisateur de la base de données
    await User.deleteOne({ _id: objectId });
  } catch (error) {
    console.error('Error deleting user:', error);
    return "Échec de la suppression de l'utilisateur";
  }

  // Déconnecter l'utilisateur

  await signOut({
    redirectTo: '/',
  });
}
