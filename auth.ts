// auth.ts

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { z } from 'zod';
import User from '@/models/User';

import type { BasicAppUserInfo, NewAppUser } from '@/types/app-user';
import bcrypt from 'bcrypt';
import connect from '@/app/utils/connect-db';
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
          if (!user?.password) return null;
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
      try {
        await connect();

        let mongoUserId;

        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          // Utiliser l'_id de l'utilisateur existant
          mongoUserId = existingUser._id;

          // Mettre à jour l'utilisateur si connecté via Google et le nom ou l'image est différent
          if (
            account?.provider === 'google' &&
            (user.name !== existingUser.name ||
              profile?.picture !== existingUser.image)
          ) {
            await User.updateOne(
              { email: user.email },
              { $set: { name: user.name, image: profile?.picture } }
            );
          }
        } else {
          // Si l'utilisateur se connecte via Google et n'existe pas

          const newUser: NewAppUser = new User({
            name: user.name!, // Nom fourni par Google
            email: user.email!, // Email fourni par Google
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
          try {
            const insertedUser = await User.create(newUser);
            mongoUserId = insertedUser.insertedId;
          } catch (err) {
            console.log(err + ' ' + 'p');
          }
        }

        user.id = mongoUserId;

        return true;
      } catch (err) {
        console.error("Erreur lors de la création de l'utilisateur :", err);
        throw new Error("Échec de la création de l'utilisateur");
      }
    },

    async session({ session, token }): Promise<any> {
      // Ajouter l'`_id` de MongoDB à l'objet session.user
      // console.log({ session, token });
      try {
        if (token?.sub && session.user) {
          session.user.id = token.sub;
          const role = await getStatusAndRoleUserInfo(token.sub);
          session.user.role = role?.role;
          session.user.status = role?.status;
        }

        return session;
      } catch (err) {
        console.error('Erreur dans le callback session :', err);
        throw new Error('Échec de la récupération de la session');
      }
    },
  },
});
