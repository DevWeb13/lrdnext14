import { User } from '@/app/lib/definitions';
import { auth } from '@/auth';
// import Image from 'next/image';

export default async function DisplayUserData() {
  const session = await auth();
  console.log({ session });
  const user = session?.user as User;
  console.log({ user });
  const { email, name, image } = user;
  return (
    <div>
      <h1>Display User Data</h1>
      <p>{email}</p>
      <p>{name}</p>
      {/* <Image
        src={image}
        alt={name}
        width={200}
        height={200}
      /> */}
    </div>
  );
}
