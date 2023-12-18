'use client';

import { getEmailValidUserInfo } from '@/app/lib/actions/get/get-email-valid-user-info';
import ResendEmailForm from '@/app/ui/auth/resend-email-form';

import ValidEmailForm from '@/app/ui/auth/valid-email-form';

import ValidEmailFormSkeleton from '@/app/ui/skeletons/auth/valid-email-form-skeleton';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { redirect, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
  const [isValidToken, setIsValidToken] = useState('pending');
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const id = pathname.split('/')[3];
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const name = searchParams.get('name');
  const expires = searchParams.get('expires');

  useEffect(() => {
    async function checkToken() {
      if (!id || !token || !email || !name || !expires) {
        redirect('/auth/login');
      }
      console.log('test');
      const userStatus = await getEmailValidUserInfo(id, token);
      console.log({ userStatus });
      if (userStatus === 'alreadyValid') {
        setIsValidToken('alreadyValid');
      }
      if (userStatus === 'invalidToken') {
        setIsValidToken('invalidToken');
      }
      if (userStatus === 'validToken') {
        setIsValidToken('validToken');
      }
    }

    checkToken();
  }, [token, id, email, name, expires]);

  console.log({ isValidToken });

  if (isValidToken === 'pending') {
    return <ValidEmailFormSkeleton />;
  }

  if (isValidToken === 'alreadyValid') {
    return (
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className="mb-3 text-2xl">
          Votre compte est déja validé.
          <br />
          Vous pouvez vous connecter.
        </h1>
        <Link
          href="/auth/login"
          className="flex items-center gap-5  rounded-lg bg-blue-500 bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600 hover:bg-blue-600 md:text-base"
        >
          <span>Se connecter</span>
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Link>
      </div>
    );
  }

  if (isValidToken === 'invalidToken' && id && email && name) {
    return (
      <>
        <h1 className="text-center text-2xl font-semibold">
          Le lien a expiré, merci de recommencer la procédure.
        </h1>
        <ResendEmailForm email={email} />
      </>
    );
  }

  if (isValidToken === 'validToken') {
    return <ValidEmailForm id={id} />;
  }

  return <div>Informations manquantes pour réinitialiser le mot de passe.</div>;
}
