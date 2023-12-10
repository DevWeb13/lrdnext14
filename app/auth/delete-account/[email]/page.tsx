'use client';

import { deleteUser } from '@/app/lib/actions/account-settings/delete-user';
import { PowerIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

export default function DeleteAccountPage() {
  const pathname = usePathname();
  const id = pathname.split('/')[3];

  return (
    <form
      action={async () => {
        await deleteUser(null, id);
      }}>
      <button className='mt-4 w-full bg-grey-500 hover:bg-grey-600 flex gap-5'>
        <PowerIcon className='w-6' />
        Supprimer mon compte{' '}
        <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
      </button>
    </form>
  );
}
