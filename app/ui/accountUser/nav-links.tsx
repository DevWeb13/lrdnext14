'use client';

import {
  HomeIcon,
  DocumentDuplicateIcon,
  ArrowLeftOnRectangleIcon,
  TrashIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/account', icon: HomeIcon },
  {
    name: 'Factures',
    href: '/account/invoices',
    icon: DocumentDuplicateIcon,
  },
  {
    name: 'Paramètres du compte',
    href: '/account/settings',
    icon: AdjustmentsHorizontalIcon,
  },
  {
    name: 'Se déconnecter',
    href: '/auth/logout',
    icon: ArrowLeftOnRectangleIcon,
  },
  {
    name: 'Supprimer mon compte',
    href: '/auth/delete-account',
    icon: TrashIcon,
  },
];

export default function NavLinks() {
  // Get the current pathname from Next.js navigation.
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium  md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
                'bg-red-500 hover:bg-red-600 hover:text-white':
                  link.href === '/auth/delete-account',
                'bg-grey-500 hover:bg-grey-600': link.href === '/auth/logout',
                'hover:bg-sky-100 hover:text-blue-600':
                  link.href !== '/auth/delete-account' &&
                  link.href !== '/auth/logout' &&
                  pathname !== link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
