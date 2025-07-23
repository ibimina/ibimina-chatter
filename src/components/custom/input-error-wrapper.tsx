import { cn } from '@/lib/utils';

interface IInputErrorWrapper {
  children: React.ReactNode;
  error?: string;
  className?: string;
}

const InputErrorWrapper = ({
  error,
  className,
  children,
}: IInputErrorWrapper) => {
  return (
    <div className={cn('w-full flex flex-col gap-1', className)}>
      {children}
      <span
        className={cn(
          'text-red-500 text-[12px]',
          !error ? 'hidden' : 'flex',
          'transition-all ease-in-out duration-300',
        )}
      >
        {error}
      </span>
    </div>
  );
};

export default InputErrorWrapper;
