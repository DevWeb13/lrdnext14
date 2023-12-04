import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/auth/login-form';
import GoogleLoginButton from '@/app/ui/auth/google-login-button';
export default function LoginPage() {
  return (
    <main className='flex items-center justify-center md:h-screen'>
      <div className='relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32'>
        {/* <div className='flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36'>
          <div className='w-32 text-white md:w-36'>
            <AcmeLogo />
          </div>
        </div> */}
        <LoginForm />
        <p className='absolute bottom-0 left-0 right-0 text-center text-gray-500 text-xs'>
          Ou connecter vous avec un compte Google
        </p>

        <GoogleLoginButton />
      </div>
    </main>
  );
}
