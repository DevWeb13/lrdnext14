'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions/user-actions';
import Link from 'next/link';

export default function LoginForm() {
  const [state, dispatch] = useFormState(authenticate, undefined);

  return (
    <form
      action={dispatch}
      className='space-y-3'>
      <div className='flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8'>
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className='w-full'>
          <div>
            <label
              className='mb-3 mt-5 block text-xs font-medium text-gray-900'
              htmlFor='email'>
              Email
            </label>
            <div className='relative'>
              <input
                className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
                id='email'
                type='email'
                name='email'
                placeholder='Enter your email address'
                required
              />
              <AtSymbolIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
          </div>
          <div className='mt-4'>
            <label
              className='mb-3 mt-5 block text-xs font-medium text-gray-900'
              htmlFor='password'>
              Password
            </label>
            <div className='relative'>
              <input
                className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
                id='password'
                type='password'
                name='password'
                placeholder='Enter password'
                required
                minLength={6}
              />
              <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
          </div>
        </div>
        <div className='flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20'>
          <LoginButton />
          <Link
            href='/auth/signup'
            className='bg-grey-500 hover:bg-grey-600 flex items-center gap-5 self-start rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors md:text-base'>
            <span>Créer un compte</span>{' '}
            <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
          </Link>
        </div>
        <div
          className='flex h-8 items-end space-x-1'
          aria-live='polite'
          aria-atomic='true'></div>
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
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className='mt-4 w-full'
      aria-disabled={pending}>
      Se connecter <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
    </Button>
  );
}
