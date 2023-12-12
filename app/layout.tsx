import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LRD Next.js Starter',
  description: 'A Next.js starter with TypeScript, Tailwind CSS, and ESLint',
};

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang='fr'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
