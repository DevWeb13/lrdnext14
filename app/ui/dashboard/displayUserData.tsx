import { AppUser } from '@/types/app-user';
import { auth } from '@/auth';

export default async function DisplayUserData() {
  const session = await auth();
  console.log({ session });
  const user = session?.user as AppUser;

  const { email, name } = user;
  return (
    <div>
      <h1>Display User Data</h1>
      <p>{email}</p>
      <p>{name}</p>
    </div>
  );
}
