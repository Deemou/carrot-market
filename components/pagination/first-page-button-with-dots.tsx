import ThreeDotIcon from '../icon/three-dot-icon';

interface FirstPageButtonWithDotsProps {
  onClick: () => void;
}

export default function FirstPageButtonWithDots({
  onClick
}: FirstPageButtonWithDotsProps) {
  return (
    <div className="flex items-center justify-center">
      <button
        onClick={onClick}
        type="button"
        className="aspect-square h-10 rounded-md bg-red-500"
      >
        <span>{1}</span>
      </button>
      <div className="ml-3 mr-1 aspect-square h-4">
        <ThreeDotIcon />
      </div>
    </div>
  );
}
