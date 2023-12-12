// app/auth/delete-account/[email]/page.tsx

'use client';

import { deleteUser } from '@/app/lib/actions/account-settings/delete-user';
import {
  PowerIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { useFormState } from 'react-dom';

export default function DeleteAccountPage() {
  const pathname = usePathname();
  const id = pathname.split('/')[3];

  const [state, dispatch] = useFormState(deleteUser, undefined);

  return (
    <form action={dispatch}>
      <input
        type='hidden'
        name='id'
        value={id}
      />
      <button className='mt-4 w-full bg-grey-500 hover:bg-grey-600 flex gap-5'>
        <PowerIcon className='w-6' />
        Supprimer mon compte{' '}
        <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
      </button>
      <div
        className='flex h-8 items-end space-x-1'
        id='error'
        aria-live='polite'
        aria-atomic='true'>
        {state && (
          <>
            <ExclamationCircleIcon className='h-5 w-5 text-red-500' />
            <p className='text-sm text-red-500'>{state}</p>
          </>
        )}
      </div>
    </form>
  );
}
