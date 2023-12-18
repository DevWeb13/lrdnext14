import Link from 'next/link';
import NavLinks from '@/app/ui/accountUser/nav-links';

import LogoLRD from '@/app/ui/logoLRD';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-center justify-center rounded-md bg-grey-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-20 pb-3 text-white md:w-40">
          <LogoLRD color="#ffffff" />
        </div>
      </Link>
      <nav className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
      </nav>
    </div>
  );
}
