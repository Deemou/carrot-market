import ThreeDotIcon from '@/components/icon/three-dot-icon';

interface MenuButtonProps {
  onClick: () => void;
}

export default function MenuButton({ onClick }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="aspect-square h-6 cursor-pointer"
    >
      <ThreeDotIcon />
    </button>
  );
}
