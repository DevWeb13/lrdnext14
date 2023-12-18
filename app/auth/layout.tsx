// app/auth/layout.tsx

import { auth } from '@/auth';
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
  readonly children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <main className="flex items-center justify-center md:h-screen">
      <Link
        href="/"
        className="group absolute left-6 top-3 flex h-[48px] items-center gap-5 self-start rounded-lg bg-grey-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-grey-600 md:text-base"
      >
        <span className="inline-block text-2xl font-semibold transition-transform group-hover:-translate-x-1 motion-reduce:transform-none">
          &lt;-
        </span>
        Accueil
      </Link>
      {session && (
        <Link
          href="/account"
          className="group absolute right-6 top-3 flex h-[48px] items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600 md:text-base"
        >
          Mon compte
          <span className="inline-block text-2xl font-semibold transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </Link>
      )}
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        {children}
      </div>
    </main>
  );
}
