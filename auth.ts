import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { z } from 'zod';

// import type { User } from '@/app/lib/definitions';
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

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
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
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      console.log({ user, account, profile });
      const client = await connect();
      const db = client.db();
      const users = db.collection('users');

      let mongoUserId;

      const existingUser = await users.findOne({ email: user.email });

      if (existingUser) {
        // Utiliser l'_id de l'utilisateur existant
        mongoUserId = existingUser._id;

        // Mettre à jour l'utilisateur si connecté via Google et le nom ou l'image est différent
        if (
          account?.provider === 'google' &&
          (user.name !== existingUser.name ||
            profile?.picture !== existingUser.image)
        ) {
          await users.updateOne(
            { email: user.email },
            { $set: { name: user.name, image: profile?.picture } }
          );
        }
      } else {
        // Si l'utilisateur se connecte via Google et n'existe pas, créez-le sans mot de passe
        if (account?.provider === 'google') {
          const insertedUser = await users.insertOne({
            name: user.name,
            email: user.email,
            image: profile?.picture,
            password: null, // Aucun mot de passe pour les utilisateurs Google
          });
          mongoUserId = insertedUser.insertedId;
        }
      }

      client.close();

      user.id = mongoUserId;

      return true;
    },

    async session({ session, token }) {
      // Ajouter l'`_id` de MongoDB à l'objet session.user
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
