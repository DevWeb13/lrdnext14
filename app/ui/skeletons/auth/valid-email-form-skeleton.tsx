import { ArrowRightIcon } from '@heroicons/react/24/outline';
import ButtonSkeleton from '../button-skeleton';
import { shimmer } from '../shimmer';

export default function ValidEmailFormSkeleton() {
  return (
    <form
      className={`${shimmer} relative space-y-3 overflow-hidden rounded-xl bg-gray-100 p-2 text-grey-100 shadow-sm`}
    >
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className="mb-3 text-2xl text-grey-200">
          Validez votre adresse e-mail
        </h1>

        <ValidEmailButton />

        <div className="flex h-8 items-end space-x-1"></div>
      </div>
    </form>
  );
}

function ValidEmailButton() {
  return (
    <ButtonSkeleton classname="mt-4 w-full text-grey-200">
      Cliquez pour valider votre compte{' '}
      <ArrowRightIcon className="ml-auto h-5 w-5 text-grey-200" />
    </ButtonSkeleton>
  );
}
