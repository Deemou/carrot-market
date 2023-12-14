import { AnswerWithUser } from '@/types/community';
import { useRouter } from 'next/router';
import { PROFILE_URL } from '@/routes';
import AvatarButton from '../profile/avatar-button';

interface AnswerProps {
  answer: AnswerWithUser;
}

export default function Answer({ answer }: AnswerProps) {
  const router = useRouter();
  const onAvatarClick = () => {
    router.push(`${PROFILE_URL}/${answer.user.id}`);
  };

  return (
    <div key={answer.id} className="flex items-start space-x-3">
      <AvatarButton url={answer.user.avatar} onClick={onAvatarClick} />
      <div>
        <div className="flex flex-col">
          <span>{answer.user.name}</span>
          <span>{answer.createdAt.toString().slice(0, 10)}</span>
        </div>

        <span className="mt-2">{answer.answer} </span>
      </div>
    </div>
  );
}
