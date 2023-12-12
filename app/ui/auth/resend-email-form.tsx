import { resendVerificationEmail } from '@/app/lib/actions/signup/resend-verification-email';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useFormState, useFormStatus } from 'react-dom';

export default function ResendEmailForm({
  id,
  email,
  newPassword,
  name,
}: {
  id: string;
  email: string;
  newPassword: string;
  name: string;
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(resendVerificationEmail, initialState);
  return (
    <>
      <h1 className='text-2xl font-semibold text-center'>
        Le lien a expiré, merci de recommencer la procédure.
      </h1>
      <form action={dispatch}>
        <input
          type='hidden'
          name='id'
          value={id}
        />
        <input
          type='hidden'
          name='email'
          value={email}
        />
        <input
          type='hidden'
          name='newPassword'
          value={newPassword}
        />
        <input
          type='hidden'
          name='name'
          value={name}
        />

        <ResendEmailButton />
        <div
          id='error'
          aria-live='polite'
          aria-atomic='true'
          className='flex h-8 items-end space-x-1'>
          {state.message && (
            <p className='mt-2 text-sm text-green-500'>{state.message}</p>
          )}
        </div>
      </form>
    </>
  );
}

function ResendEmailButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className='mt-4 w-full'
      aria-disabled={pending}>
      Renvoyer un lien
      <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
    </Button>
  );
}
