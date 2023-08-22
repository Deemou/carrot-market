import cls from '@/libs/client/utils';
import CheckIcon from '../icon/check-icon';

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
      <CheckIcon />
      <span>궁금해요 {wondersCount}</span>
    </button>
  );
}
