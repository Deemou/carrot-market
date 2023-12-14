import Link from 'next/link';
import { PROFILE_URL } from '@/routes';
import { useRouter } from 'next/router';
import AvatarButton from './avatar-button';

interface ProfileInfoProps {
  avatar: string | null;
  userId: number;
  userName: string | null;
}

export default function ProfileInfo({
  avatar,
  userId,
  userName
}: ProfileInfoProps) {
  const router = useRouter();
  const onAvatarClick = () => {
    router.push(`${PROFILE_URL}/${userId}`);
  };

  return (
    <div className="my-3 flex items-center space-x-3">
      <AvatarButton url={avatar} onClick={onAvatarClick} />
      <div className="flex h-12 flex-col justify-between">
        <h4>{userName}</h4>
        <Link href={`${PROFILE_URL}/${userId}`} className="text-gray-500">
          View profile &rarr;
        </Link>
      </div>
    </div>
  );
}
