import { shimmer } from './shimmer';

export default function ButtonSkeleton({
  classname,
  children,
}: {
  readonly classname?: string;
  readonly children: React.ReactNode;
}) {
  return (
    <button
      className={`${shimmer} flex items-center rounded-lg bg-grey-400 px-4 px-6 py-3 text-sm font-medium text-grey-100 transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500  aria-disabled:cursor-not-allowed aria-disabled:opacity-50 ${classname}`}
      aria-disabled="true"
    >
      {children}
    </button>
  );
}
