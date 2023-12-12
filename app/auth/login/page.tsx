// app/auth/login/page.tsx

import LoginForm from '@/app/ui/auth/login-form';
import GoogleLoginButton from '@/app/ui/auth/google-login-button';
export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <p className=' left-0 right-0 text-center text-gray-500 text-xs'>
        Ou connecter vous avec un compte Google
      </p>
      <GoogleLoginButton />
    </>
  );
}
