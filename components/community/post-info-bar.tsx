import MessageIcon from '../icon/message-icon';
import WonderButton from './wonder-button';

interface PostInfoBarProps {
  onWonderClick: () => void;
  isWondering: boolean;
  wondersCount: number;
  answersCount: number;
}

export default function PostInfoBar({
  onWonderClick,
  isWondering,
  wondersCount,
  answersCount
}: PostInfoBarProps) {
  return (
    <div className="mt-3 flex w-full space-x-5 border-b-[2px] border-t py-2.5  text-gray-700">
      <WonderButton
        onWonderClick={onWonderClick}
        isWondering={isWondering}
        wondersCount={wondersCount}
      />
      <div className="flex items-center space-x-2">
        <MessageIcon />
        <span>답변 {answersCount}</span>
      </div>
    </div>
  );
}
