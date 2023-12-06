interface CancelButtonProps {
  onClick: () => void;
}

export default function CancelButton({ onClick }: CancelButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="rounded-md border p-2 hover:bg-[#202020]"
    >
      Cancel
    </button>
  );
}
