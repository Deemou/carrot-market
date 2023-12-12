import Link from 'next/link';
import Avatar from '../common/avatar';
import { PROFILE_URL } from '@/routes';

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
  return (
    <div className="my-3 flex items-center space-x-3">
      <Avatar url={avatar} />
      <div className="flex h-12 flex-col justify-between">
        <h4>{userName}</h4>
        <Link href={`${PROFILE_URL}/${userId}`} className="text-gray-500">
          View profile &rarr;
        </Link>
      </div>
    </div>
  );
}
