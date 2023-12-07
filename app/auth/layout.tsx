import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'LRD Next.js Starter - Auth',
  description:
    'A Next.js starter with TypeScript, Tailwind CSS, and ESLint - Auth',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='flex items-center justify-center md:h-screen'>
      <Link
        href='/'
        className='absolute top-3 left-6 bg-grey-500 hover:bg-grey-600 flex items-center gap-5 self-start rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors md:text-base '>
        <ArrowLeftIcon className='ml-auto h-5 w-5 ' />
        Accueil
      </Link>
      <div className='relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32'>
        {children}
      </div>
    </main>
  );
}
