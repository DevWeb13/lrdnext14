// auth.config.ts

import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnLogout = nextUrl.pathname.startsWith('/auth/logout');
      const isOnAccountUser = nextUrl.pathname.startsWith('/account');

      if ((isOnDashboard || isOnLogout || isOnAccountUser) && !isLoggedIn) {
        return false; // Redirect unauthenticated users to login page
      }

      // Redirect authenticated users to account only if they are on the sign-in page
      if (nextUrl.pathname === '/auth/login' && isLoggedIn) {
        return Response.redirect(new URL('/account', nextUrl));
      }

      return true; // Allow access to other pages
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
