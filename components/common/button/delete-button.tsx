interface DeleteButtonProps {
  onClick: () => void;
}

export default function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="rounded-md bg-red-600 p-2"
    >
      Delete
    </button>
  );
}
