import { signOut } from '@/auth';
import { ArrowRightIcon, PowerIcon } from '@heroicons/react/24/outline';
import { useFormStatus } from 'react-dom';
import { Button } from '../button';

export default function LogoutForm() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}>
      <LogoutButton />
    </form>
  );
}

function LogoutButton() {
  return (
    <Button className='mt-4 w-full bg-grey-500 hover:bg-grey-600 flex gap-5'>
      <PowerIcon className='w-6' />
      Se déconnecter <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
    </Button>
  );
}
