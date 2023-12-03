import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import connect from '@/app/utils/connect-db';

export async function getUser(email: string) {
  try {
    // Utiliser la fonction connect pour obtenir le client MongoDB
    const client = await connect();

    // Accéder à la base de données et à la collection 'users'
    const db = client.db();
    const users = db.collection('users');
    console.log('Fetching user from database...' + users.collectionName);

    // Rechercher l'utilisateur par email
    const user = await users.findOne({ email });

    // Retourner les informations de l'utilisateur (ou null si non trouvé)
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          console.log('User found: ' + user?._id);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
