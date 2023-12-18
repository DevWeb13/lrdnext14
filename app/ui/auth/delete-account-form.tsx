// app/ui/auth/delete-account-form.tsx

'use client';

import { deleteUser } from '@/app/lib/actions/account-settings/delete-user';
import { PowerIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useFormState } from 'react-dom';
import { Button } from '../button';

export default function DeleteAccountForm() {
  const [state, dispatch] = useFormState(deleteUser, undefined);
  return (
    <form action={dispatch} className="flex flex-col justify-center">
      <Button className="group mt-4 flex justify-around gap-5 bg-red-500 hover:bg-red-600">
        <PowerIcon className="w-6" />
        Supprimer mon compte{' '}
        <span className="inline-block text-2xl font-semibold transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </Button>
      <div
        className="flex h-8 items-end space-x-1"
        id="error"
        aria-live="polite"
        aria-atomic="true"
      >
        {state && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{state}</p>
          </>
        )}
      </div>
    </form>
  );
}
