// app/ui/auth/logout-form.tsx

import { signOut } from '@/auth';
import { PowerIcon } from '@heroicons/react/24/outline';
import { Button } from '../button';

export default async function LogoutForm({ email }: { email: string }) {
  return (
    <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
      <h1 className={`mb-3 text-2xl`}>
        {email}
        <br />
        Voulez vous vous déconnecter ?
      </h1>
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
        className="flex justify-center"
      >
        <LogoutButton />
      </form>
    </div>
  );
}

function LogoutButton() {
  return (
    <Button className="group mt-4 flex  gap-5 bg-grey-500 hover:bg-grey-600 active:bg-grey-600">
      <PowerIcon className="w-5 md:w-6" />
      Se déconnecter{' '}
      <span className="inline-block text-2xl font-semibold transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
        -&gt;
      </span>
    </Button>
  );
}
