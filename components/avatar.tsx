import cls from '@libs/client/utils';
import Image from 'next/image';

interface AvatarProps {
  url?: string | null;
  large?: boolean;
}

export default function Avatar({ url, large }: AvatarProps) {
  return url ? (
    <div className={cls('relative aspect-square', large ? 'h-12' : 'h-10')}>
      <Image
        src={url}
        fill
        alt="avatar"
        priority
        className="rounded-full bg-transparent object-cover"
      />
    </div>
  ) : (
    <div
      className={cls(
        'relative aspect-square rounded-full bg-orange-500',
        large ? 'h-12' : 'h-10'
      )}
    />
  );
}

Avatar.defaultProps = {
  url: '',
  large: false
};
