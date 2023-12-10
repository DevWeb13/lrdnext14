import { validEmail } from '@/app/lib/actions/signup/valid-email';
import { useFormState, useFormStatus } from 'react-dom';
import { lusitana } from '../fonts';
import { Button } from '../button';
import {
  ArrowRightIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

export default function ValidEmailForm({
  id,
  newPassword,
}: {
  id: string;
  newPassword: string;
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(validEmail, initialState);
  console.log(state);
  return (
    <form
      action={dispatch}
      className='space-y-3'>
      <div className='flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8'>
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Validez votre adresse e-mail
        </h1>
        <input
          type='hidden'
          name='id'
          value={id}
        />
        <input
          type='hidden'
          name='newPassword'
          value={newPassword}
        />
        <ValidEmailButton />

        <div
          id='error'
          aria-live='polite'
          aria-atomic='true'
          className='flex h-8 items-end space-x-1'>
          {state.message && (
            <>
              <ExclamationCircleIcon className='h-5 w-5 text-red-500' />
              <p className='mt-2 text-sm text-red-500'>{state.message}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

function ValidEmailButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className='mt-4 w-full'
      aria-disabled={pending}>
      Cliquez pour valider votre compte{' '}
      <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
    </Button>
  );
}
