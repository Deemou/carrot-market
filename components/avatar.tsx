import Image from 'next/image';

interface AvatarProps {
  url?: string | null;
}

export default function Avatar({ url }: AvatarProps) {
  return url ? (
    <div className={'relative aspect-square h-12'}>
      <Image
        src={url}
        fill
        sizes="50vw"
        alt="avatar"
        priority
        className="rounded-full bg-transparent object-cover"
      />
    </div>
  ) : (
    <div className={'relative aspect-square h-12 rounded-full bg-orange-500'} />
  );
}

Avatar.defaultProps = {
  url: ''
};
