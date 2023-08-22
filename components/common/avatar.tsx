import Image from 'next/image';

interface AvatarProps {
  url: string | undefined | null;
}

export default function Avatar({ url }: AvatarProps) {
  return url ? (
    <div className="relative aspect-square h-10">
      <Image
        src={url}
        alt="avatar"
        fill
        sizes="50vw"
        priority
        className="rounded-full bg-transparent object-cover"
      />
    </div>
  ) : (
    <div className="relative aspect-square h-10 rounded-full bg-orange-500" />
  );
}
