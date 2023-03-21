import cls from '@libs/client/utils';
import Image from 'next/image';

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
      {avatarUrl ? (
        <div className="relative h-10 w-10">
          <Image
            src={avatarUrl}
            fill
            alt="avatar"
            priority
            className="rounded-full bg-transparent object-cover"
          />
        </div>
      ) : (
        <div className="h-10 w-10 rounded-full bg-orange-500" />
      )}
      <div className="w-1/2 rounded-md border border-gray-300 p-2 text-sm text-gray-700">
        <p>{message}</p>
      </div>
    </div>
  );
}

Message.defaultProps = {
  reversed: false,
  avatarUrl: ''
};
