import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { z } from 'zod';

import type { BasicUserInfo } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import connect from '@/app/utils/connect-db';
import { getBasicUserInfo } from '@/app/lib/actions/user-actions';

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
          const user = await getBasicUserInfo(email);
          if (!user || !user.password) return null;
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
        // Si l'utilisateur se connecte via Google et n'existe pas
        if (account?.provider === 'google') {
          const insertedUser = await users.insertOne({
            name: user.name, // Nom fourni par Google
            email: user.email, // Email fourni par Google
            image: user.image, // Image fournie par Google
            role: 'user', // Valeur par défaut
            status: 'active', // Valeur par défaut
            // Autres champs avec des valeurs par défaut
            password: null, // Pas de mot de passe pour les utilisateurs Google
            createdAt: new Date(),
            updatedAt: new Date(),
            emailVerificationToken: null,
            emailVerificationTokenExpiredAt: null,
            resetPasswordToken: null,
            resetPasswordTokenExpiredAt: null,
          });
          mongoUserId = insertedUser.insertedId;
        }
      }

      client.close();

      user.id = mongoUserId;

      return true;
    },

    async session({ session, token }): Promise<any> {
      // Ajouter l'`_id` de MongoDB à l'objet session.user
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
