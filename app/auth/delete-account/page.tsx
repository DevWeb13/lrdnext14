// app/auth/delete-account/[email]/page.tsx

import DeleteAccountForm from '@/app/ui/auth/delete-account-form';

export default function DeleteAccountPage() {
  return (
    <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
      <h1 className={`mb-3 text-2xl`}>
        Voulez vous réellement supprimer votre compte?
        <br />
        <span className="text-bold text-red-500">
          Attention cette action est irréversible!
        </span>
      </h1>
      <DeleteAccountForm />
    </div>
  );
}
