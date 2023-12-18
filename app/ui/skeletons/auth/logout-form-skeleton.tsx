// app/ui/skeletons/auth/logout-form-skeleton.tsx

import { PowerIcon } from '@heroicons/react/24/outline';
import ButtonSkeleton from '../button-skeleton';
import { shimmer } from '../shimmer';

export default function LogoutFormSkeleton() {
  return (
    <div
      className={`${shimmer} flex-1 overflow-hidden rounded-lg bg-gray-100 px-6 pb-4 pt-8 text-grey-100 shadow-sm`}
    >
      <h1 className={`mb-3 text-2xl`}>
        E-mail
        <br />
        Voulez vous vous déconnecter ?
      </h1>
      <div className="flex justify-center">
        <LogoutButton />
      </div>
    </div>
  );
}

function LogoutButton() {
  return (
    <ButtonSkeleton classname="group mt-4 flex  gap-5 text-grey-200 hover:bg-grey-600 active:bg-grey-600">
      <PowerIcon className="w-5 md:w-6" />
      Se déconnecter{' '}
      <span className="inline-block text-2xl font-semibold transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
        -&gt;
      </span>
    </ButtonSkeleton>
  );
}
