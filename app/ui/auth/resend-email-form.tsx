// app/ui/auth/resend-email-form.tsx

import { resendVerificationEmail } from '@/app/lib/actions/signup/resend-verification-email';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useFormState } from 'react-dom';

export default function ResendEmailForm({ email }: { readonly email: string }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(resendVerificationEmail, initialState);
  return (
    <form action={dispatch}>
      <input type="hidden" name="email" value={email} />

      <ResendEmailButton />
      <div
        id="error"
        aria-live="polite"
        aria-atomic="true"
        className="flex h-8 items-end space-x-1"
      >
        {state.message && (
          <p className="mt-2 text-sm text-green-500">{state.message}</p>
        )}
      </div>
    </form>
  );
}

function ResendEmailButton() {
  return (
    <button className="flex items-center gap-5 self-start rounded-lg  text-xs font-medium text-blue-400 transition-colors hover:text-blue-600 hover:underline md:text-xs">
      Renvoyer un Email avec un lien d&apos;activation de compte{' '}
      <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </button>
  );
}
