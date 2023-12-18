// app/auth/logout/page.tsx

import LogoutForm from '@/app/ui/auth/logout-form';
import { auth } from '@/auth';
import { AppUser } from '@/types/app-user';

export default async function LogoutPage() {
  const session = await auth();

  const user = session?.user as AppUser;

  const { email } = user;
  return <LogoutForm email={email} />;
}
