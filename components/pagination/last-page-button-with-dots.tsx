import ThreeDotIcon from '../icon/three-dot-icon';

interface LastPageButtonWithDotsProps {
  lastPage: number;
  onClick: () => void;
}

export default function LastPageButtonWithDots({
  lastPage,
  onClick
}: LastPageButtonWithDotsProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="ml-1 mr-3 aspect-square h-4">
        <ThreeDotIcon />
      </div>
      <button
        onClick={onClick}
        type="button"
        className="aspect-square h-10 rounded-md bg-red-500"
      >
        <span>{lastPage}</span>
      </button>
    </div>
  );
}
