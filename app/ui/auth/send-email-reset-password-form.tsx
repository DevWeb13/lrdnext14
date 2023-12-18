// app/ui/auth/send-email-reset-password-form.tsx

'use client';

import {
  ArrowRightIcon,
  AtSymbolIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../button';
import { useFormState } from 'react-dom';
import { sendEmailResetPassword } from '@/app/lib/actions/account-settings/send-email-reset-password';
import ResendEmailForm from './resend-email-form';

export default function SendEmailResetPassword() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(sendEmailResetPassword, initialState);

  return (
    <>
      <form action={dispatch}>
        <h1 className="mb-3 text-2xl">Réinitialiser votre mot de passe</h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Entrez votre email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Entrez votre email"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div
            className="flex h-8 items-end space-x-1"
            id="error"
            aria-live="polite"
            aria-atomic="true"
          ></div>

          <div
            className="flex h-8 items-center space-x-1"
            id="error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.message && (
              <>
                <ExclamationCircleIcon className="h10 w-10 min-w-[30px]  text-red-500" />
                <p className="text-sm text-red-500">{state.message}</p>
              </>
            )}
          </div>
        </div>
        <ResetPasswordButton />
      </form>
      {state.errors?.email &&
        (console.log(state.errors.email[0]),
        (<ResendEmailForm email={state.errors.email[0]} />))}
    </>
  );
}

function ResetPasswordButton() {
  return (
    <Button className="mt-4 w-full md:text-base" type="submit">
      Réinitialiser mon mot de passe{' '}
      <ArrowRightIcon className="ml-auto h-5 w-5 " />
    </Button>
  );
}
