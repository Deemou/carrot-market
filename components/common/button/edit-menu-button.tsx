import EditIcon from '@/components/icon/edit-icon';

interface EditMenuButtonProps {
  onClick: () => void;
}

export default function EditMenuButton({ onClick }: EditMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex w-full cursor-pointer flex-row space-x-3 px-3 py-1.5 hover:bg-[#202020]"
    >
      <EditIcon />
      <span>Edit</span>
    </button>
  );
}
