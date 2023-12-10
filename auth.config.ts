import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // console.log({ auth, nextUrl });
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnLogout = nextUrl.pathname.startsWith('/auth/logout');

      if ((isOnDashboard || isOnLogout) && !isLoggedIn) {
        return false; // Redirect unauthenticated users to login page
      }

      // Redirect authenticated users to dashboard only if they are on the sign-in page
      if (nextUrl.pathname === '/auth/login' && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true; // Allow access to other pages
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
