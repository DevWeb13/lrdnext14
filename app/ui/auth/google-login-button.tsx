// app/ui/auth/google-login-button.tsx

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Button } from '../button';
import { signIn } from '@/auth';

export default function GoogleLoginButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google', { callbackUrl: '/' });
      }}
    >
      <GoogleButton />
    </form>
  );
}

function GoogleButton() {
  return (
    <Button className=" w-full md:text-base">
      Se connecter avec Google
      <ArrowRightIcon className="ml-auto h-5 w-5 " />
    </Button>
  );
}
