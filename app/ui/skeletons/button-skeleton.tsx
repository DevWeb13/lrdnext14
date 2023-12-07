export default function ButtonSkeleton({
  classname,
  children,
}: {
  classname?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      className={
        'flex px-6 py-3 items-center rounded-lg bg-grey-400 px-4 text-sm font-medium text-transparent transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500  aria-disabled:cursor-not-allowed aria-disabled:opacity-50' +
        ' ' +
        classname
      }
      aria-disabled='true'>
      {children}
    </button>
  );
}
