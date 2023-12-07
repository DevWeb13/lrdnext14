import { ArrowRightIcon, KeyIcon } from '@heroicons/react/24/outline';
import ButtonSkeleton from './button-skeleton';

// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export default function ResetPasswordFormSkeleton() {
  return (
    <form
      className={`${shimmer} space-y-3 relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm text-grey-100`}>
      <div className={`flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8`}>
        <h1 className={`mb-3 text-2xl text-grey-200`}>Nouveau mot de passe</h1>
        <input
          type='hidden'
          name='id'
        />
        <div className='w-full'>
          <div className='mt-4'>
            <label className='mb-3 mt-5 block text-xs font-medium text-grey-200'>
              Entrer votre nouveau mot de passe
            </label>
            <div className='relative'>
              <input
                className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-grey-200'
                placeholder='Entrer votre nouveau mot de passe'
              />
              <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-grey-200 ' />
            </div>
            <div></div>
          </div>
          <div className='mt-4'>
            <label className='mb-3 mt-5 block text-xs font-medium text-transparent'>
              Confirmer votre nouveau mot de passe
            </label>
            <div className='relative'>
              <input
                className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-grey-200'
                placeholder='Confirmer votre nouveau mot de passe'
              />
              <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-grey-200 ' />
            </div>
            <div></div>
          </div>
        </div>
        <ResetPasswordButtonSkeleton />
        <div className='flex h-8 items-end space-x-1' />
      </div>
    </form>
  );
}

function ResetPasswordButtonSkeleton() {
  return (
    <ButtonSkeleton classname='mt-4 w-full text-grey-200'>
      Réinitialiser mon mot de passe
      <ArrowRightIcon className='ml-auto h-5 w-5 text-grey-200' />
    </ButtonSkeleton>
  );
}