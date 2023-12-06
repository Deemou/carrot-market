import { AnswerWithUser } from '@/types/community';
import Avatar from '../common/avatar';

interface AnswerProps {
  answer: AnswerWithUser;
}

export default function Answer({ answer }: AnswerProps) {
  return (
    <div key={answer.id} className="flex items-start space-x-3">
      <Avatar url={answer.user.avatar} />
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
