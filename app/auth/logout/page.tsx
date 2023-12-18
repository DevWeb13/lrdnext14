// app/auth/logout/page.tsx

import LogoutForm from '@/app/ui/auth/logout-form';
import { Suspense } from 'react';
import LogoutFormSkeleton from '@/app/ui/skeletons/auth/logout-form-skeleton';

export default function LogoutPage() {
  return (
    <Suspense fallback={<LogoutFormSkeleton />}>
      <LogoutForm />
    </Suspense>
  );
}
