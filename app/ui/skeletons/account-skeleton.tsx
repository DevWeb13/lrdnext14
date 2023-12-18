// app/ui/skeletons/account-skeleton.tsx
import { shimmer } from './shimmer';

export default function AccountSkeleton() {
  return (
    <div className={`${shimmer} container mx-auto p-4 text-grey-100`}>
      <div className="flex flex-col items-center justify-center justify-center overflow-hidden rounded-lg bg-white p-4 shadow-lg md:justify-between ">
        <div className="flex flex-col items-center p-4">
          <h1 className="text-xl font-bold">Name</h1>
          <p className="text-gray-100">
            <span className=" font-bold">Id:</span>
          </p>
          <p>
            <span className=" font-bold">E-mail:</span>
          </p>
          <p>
            <span className=" font-bold">Status:</span>
          </p>
          <p>
            <span className=" font-bold">Role:</span>
          </p>
        </div>
      </div>
    </div>
  );
}
