// app/ui/auth/login-form.tsx

'use client';

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { authenticate } from '@/app/lib/actions/account-settings/authenticate';
import Link from 'next/link';
import ResendEmailForm from './resend-email-form';

export default function LoginForm() {
  const initialState = { message: null, invalid: null };
  const [state, dispatch] = useFormState(authenticate, initialState);

  return (
    <>
      <form action={dispatch} className="space-y-3">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className="mb-3 text-2xl">Connectez vous pour continuer.</h1>
          <div className="w-full">
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  minLength={6}
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div
              className="mt-4  flex items-center space-x-1"
              id="error"
              aria-live="polite"
              aria-atomic="true"
            >
              {state.message && (
                <>
                  <ExclamationCircleIcon className="h10 w-10 min-w-[30px] text-red-500" />
                  <p className="text-sm text-red-500">{state.message}</p>
                </>
              )}
            </div>
          </div>

          <LoginButton />
        </div>
      </form>
      {state.errors?.email &&
        (console.log(state.errors.email[0]),
        (<ResendEmailForm email={state.errors.email[0]} />))}
      <Link
        href="/auth/send-email-reset-password"
        className="flex items-center gap-5 self-start rounded-lg  text-xs font-medium text-blue-400 transition-colors hover:text-blue-600 hover:underline md:text-xs"
      >
        <span>Mot de passe oublié ?</span>{' '}
      </Link>
      <Link
        href="/auth/signup"
        className="flex w-full items-center gap-5 self-start rounded-lg bg-grey-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-grey-600 md:text-base"
      >
        <span>Créer un compte</span>{' '}
        <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
      </Link>
    </>
  );
}

function LoginButton() {
  return (
    <Button className="mt-4 w-full md:text-base">
      Se connecter <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
