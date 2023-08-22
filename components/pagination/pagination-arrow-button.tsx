import NextIcon from '../icon/next-icon';
import PrevIcon from '../icon/prev-icon';

interface PaginationArrowButtonProps {
  direction: 'prev' | 'next';
  onClickArrowButton: () => void;
}

export default function PaginationArrowButton({
  direction,
  onClickArrowButton
}: PaginationArrowButtonProps) {
  return (
    <button onClick={onClickArrowButton} type="button">
      {direction === 'prev' && <PrevIcon />}
      {direction === 'next' && <NextIcon />}
    </button>
  );
}
