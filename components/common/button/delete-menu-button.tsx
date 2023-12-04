import DeleteIcon from '@/components/icon/delete-icon';

interface DeleteMenuButtonProps {
  onClick: () => void;
}

export default function DeleteMenuButton({ onClick }: DeleteMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex cursor-pointer flex-row space-x-3 px-3 py-1.5 hover:bg-[#202020]"
    >
      <DeleteIcon />
      <span className="text-[#ff0000]">Delete</span>
    </button>
  );
}
