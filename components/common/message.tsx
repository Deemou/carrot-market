import cls from '@libs/client/utils';
import Avatar from '@/components/common/avatar';

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string;
}

export default function Message({
  message,
  avatarUrl,
  reversed
}: MessageProps) {
  return (
    <div
      className={cls(
        'flex items-start space-x-2',
        reversed ? 'flex-row-reverse space-x-reverse' : ''
      )}
    >
      <Avatar url={avatarUrl} />
      <span className="w-1/2 rounded-md border border-gray-300 p-2 text-gray-700">
        <span>{message}</span>
      </span>
    </div>
  );
}

Message.defaultProps = {
  reversed: false,
  avatarUrl: ''
};
