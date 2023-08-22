import EmptyHeartIcon from '../../icon/empty-heart-icon';
import FilledHeartIcon from '../../icon/filled-heart-icon';

interface LikeButtonProps {
  onFavClick: () => void;
  isLiked: boolean;
}

export default function LikeButton({ onFavClick, isLiked }: LikeButtonProps) {
  return (
    <button
      onClick={onFavClick}
      type="button"
      aria-label="like"
      className="flex items-center justify-center rounded-md p-1"
    >
      {isLiked ? <FilledHeartIcon /> : <EmptyHeartIcon />}
    </button>
  );
}
