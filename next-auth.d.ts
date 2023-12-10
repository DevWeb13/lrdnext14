import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
    status?: string;
  }
}
