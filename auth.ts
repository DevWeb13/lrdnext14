import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { z } from 'zod';

import type { BasicAppUserInfo } from '@/types/app-user';
import bcrypt from 'bcrypt';
import { connectToCollection } from '@/app/utils/connect-db';
import { getStatusAndRoleUserInfo } from '@/app/lib/actions/get/get-status-and-role-user-info';
import { getBasicUserInfo } from '@/app/lib/actions/get/get-basic-user-info';

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
          const user: BasicAppUserInfo | null = await getBasicUserInfo(email);
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
      const { client, collection } = await connectToCollection('users');

      let mongoUserId;

      const existingUser = await collection.findOne({ email: user.email });

      if (existingUser) {
        // Utiliser l'_id de l'utilisateur existant
        mongoUserId = existingUser._id;

        // Mettre à jour l'utilisateur si connecté via Google et le nom ou l'image est différent
        if (
          account?.provider === 'google' &&
          (user.name !== existingUser.name ||
            profile?.picture !== existingUser.image)
        ) {
          await collection.updateOne(
            { email: user.email },
            { $set: { name: user.name, image: profile?.picture } }
          );
        }
      } else {
        // Si l'utilisateur se connecte via Google et n'existe pas
        if (account?.provider === 'google') {
          const insertedUser = await collection.insertOne({
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
      console.log('You deconnected to MongoDb');

      user.id = mongoUserId;

      return true;
    },

    async session({ session, token }): Promise<any> {
      // Ajouter l'`_id` de MongoDB à l'objet session.user
      // console.log({ session, token });
      if (token?.sub && session.user) {
        session.user.id = token.sub;
        const role = await getStatusAndRoleUserInfo(token.sub);
        // console.log({ role });
        session.user.role = role?.role;
        session.user.status = role?.status;
      }

      return session;
    },
  },
});
