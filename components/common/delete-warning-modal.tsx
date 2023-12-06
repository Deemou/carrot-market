import CancelButton from './button/cancel-button';
import DeleteButton from './button/delete-button';
import DeleteWaringMessage from './delete-warning-message';

interface DeleteWarningModalProps {
  type: string;
  onDeleteOverlayClick: () => void;
  onDeleteClick: () => void;
}

export default function DeleteWarningModal({
  type,
  onDeleteOverlayClick,
  onDeleteClick
}: DeleteWarningModalProps) {
  return (
    <div
      onClick={onDeleteOverlayClick}
      className="fixed left-0 top-0 z-20 flex min-h-screen w-screen"
      aria-hidden
    >
      <div className="z-40 m-auto w-80 max-w-[80vw] space-y-5 rounded-xl bg-black px-8 py-4 ring-2 ring-gray-900">
        <DeleteWaringMessage type={type} />
        <div className="flex flex-col space-y-3 py-2 font-semibold">
          <DeleteButton onClick={onDeleteClick} />
          <CancelButton onClick={onDeleteOverlayClick} />
        </div>
      </div>
    </div>
  );
}
