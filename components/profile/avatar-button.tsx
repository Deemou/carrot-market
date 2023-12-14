import Avatar from '../common/avatar';

interface AvatarButtonProps {
  url: string | undefined | null;
  onClick: () => void;
  onBlur?: () => void;
}

export default function AvatarButton({
  url,
  onClick,
  onBlur
}: AvatarButtonProps) {
  return (
    <button type="button" onClick={onClick} onBlur={onBlur}>
      <Avatar url={url} />
    </button>
  );
}

AvatarButton.defaultProps = {
  onBlur: undefined
};
