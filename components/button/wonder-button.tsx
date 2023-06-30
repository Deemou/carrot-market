import cls from '@/libs/client/utils';

interface WonderButtonProps {
  onWonderClick: () => void;
  isWondering: boolean;
  wondersCount: number;
}

export default function WonderButton({
  onWonderClick,
  isWondering,
  wondersCount
}: WonderButtonProps) {
  return (
    <button
      onClick={onWonderClick}
      type="button"
      className={cls(
        'flex items-center space-x-2',
        isWondering ? 'text-teal-600' : ''
      )}
    >
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span>궁금해요 {wondersCount}</span>
    </button>
  );
}
