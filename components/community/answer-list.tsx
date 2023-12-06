import { AnswerWithUser } from '@/types/community';
import Answer from './answer';

interface AnswerListProps {
  answers: AnswerWithUser[];
}

export default function AnswerList({ answers }: AnswerListProps) {
  return (
    <div className="my-5 space-y-5">
      {answers.map((answer) => (
        <Answer key={answer.id} answer={answer} />
      ))}
    </div>
  );
}
