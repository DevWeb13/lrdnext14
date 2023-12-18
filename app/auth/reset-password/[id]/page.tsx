'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ResetPasswordForm from '@/app/ui/auth/reset-password-form';
import { getResetPasswordUserInfo } from '@/app/lib/actions/get/get-reset-password-user-info';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import ResetPasswordFormSkeleton from '@/app/ui/skeletons/auth/reset-password-form-skeletons';

export default function ResetPasswordPage() {
  const [isValidToken, setIsValidToken] = useState('pending');
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const id = pathname.split('/')[3];
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  console.log(token);

  useEffect(() => {
    async function checkToken() {
      if (!email || !token || !id) return;
      const user = await getResetPasswordUserInfo(id, token);
      if (!user) {
        setIsValidToken('invalid');

        return;
      }
      setIsValidToken('valid');
    }

    checkToken();
  }, [id, token, email]);

  console.log({ isValidToken });

  if (isValidToken === 'pending') {
    return <ResetPasswordFormSkeleton />;
  }

  if (isValidToken === 'invalid') {
    return (
      <>
        <h1 className="text-center text-2xl font-semibold">
          Le lien a expiré, merci de recommencer la procédure.
        </h1>
        <Link
          href="/auth/send-email-reset-password"
          className="flex items-center gap-5  rounded-lg bg-blue-500 bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600 hover:bg-blue-600 md:text-base"
        >
          <span>Renvoyer un lien</span>
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Link>
      </>
    );
  }

  return <ResetPasswordForm id={id} />;
}
