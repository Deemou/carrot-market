import Overlay from '../overlay';
import DeleteMenuButton from './delete-menu-button';
import EditMenuButton from './edit-menu-button';

interface MenuModalProps {
  onOverlayClick: () => void;
  onEditClick: () => void;
  onDeleteMenuClick: () => void;
}

export default function MenuModal({
  onOverlayClick,
  onEditClick,
  onDeleteMenuClick
}: MenuModalProps) {
  return (
    <div>
      <Overlay onClick={onOverlayClick} />
      <div className="absolute right-0 top-2 z-20 rounded-md bg-black py-2 ring-2 ring-gray-900">
        <EditMenuButton onClick={onEditClick} />
        <DeleteMenuButton onClick={onDeleteMenuClick} />
      </div>
    </div>
  );
}
