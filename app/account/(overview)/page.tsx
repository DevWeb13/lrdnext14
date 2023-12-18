// app/accountUser/(overview)/page.tsx

import { auth } from '@/auth';
import { AppUser } from '@/types/app-user';
import Image from 'next/image';

export default async function AccountUserPage() {
  const session = await auth();

  const user = session?.user as AppUser;

  const { name, email, id, role, status, image } = user;
  return (
    <main>
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center justify-center overflow-hidden rounded-lg bg-white p-4 shadow-lg md:justify-between ">
          {image && (
            <Image
              className="rounded-full duration-200 group-hover:scale-105"
              src={image}
              title="Verified avatar user"
              alt="default avatar rounded-full"
              width={112}
              height={112}
            />
          )}
          <div className="flex flex-col items-center p-4">
            <h1 className="text-xl font-bold">{name}</h1>
            <p className="text-gray-700">
              <span className=" font-bold">Id:</span> {id}
            </p>
            <p>
              <span className=" font-bold">E-mail:</span> {email}
            </p>
            <p>
              <span className=" font-bold">Status:</span> {status}
            </p>
            <p>
              <span className=" font-bold">Role:</span> {role}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
