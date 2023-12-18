// app/auth/confirm-valid-email/page.tsx

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ConfirmValidEmailPage() {
  return (
    <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
      <h1 className={` mb-3 text-2xl`}>
        Votre compte est désormais validé.
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
