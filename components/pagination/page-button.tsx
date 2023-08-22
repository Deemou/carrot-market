import cls from '@/libs/client/utils';

interface PageButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

export default function PageButton({
  page,
  isActive,
  onClick
}: PageButtonProps) {
  return (
    <button
      onClick={onClick}
      key={page}
      type="button"
      className={cls(
        'aspect-square h-10 rounded-md',
        isActive ? 'border border-white bg-black' : 'bg-red-500'
      )}
      disabled={isActive}
    >
      <span>{page}</span>
    </button>
  );
}
