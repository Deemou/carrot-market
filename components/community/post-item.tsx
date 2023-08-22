import Link from 'next/link';
import CheckIcon from '../icon/check-icon';
import MessageIcon from '../icon/message-icon';

interface PostProps {
  id: number;
  question: string;
  createdAt: Date;
  author: string | null;
  wonderings: number;
  answers: number;
}

export default function PostItem({
  id,
  question,
  createdAt,
  author,
  wonderings,
  answers
}: PostProps) {
  return (
    <Link
      href={`/community/${id}`}
      key={id}
      className="flex cursor-pointer flex-col items-start pt-4"
    >
      <span className="flex items-center rounded-full bg-gray-100 px-2.5 text-gray-800">
        Question
      </span>
      <div className="mt-2">
        <span className="text-orange-500">Q.</span> {question}
      </div>
      <div className="mt-5 flex w-full items-center justify-between text-gray-500">
        <span>{author}</span>
        <span>{createdAt.toString().slice(0, 10)}</span>
      </div>
      <div className="mt-3 flex w-full space-x-5 border-t py-2.5 text-gray-700">
        <span className="flex items-center space-x-2">
          <CheckIcon />
          <span>궁금해요 {wonderings}</span>
        </span>
        <span className="flex items-center space-x-2">
          <MessageIcon />
          <span>답변 {answers}</span>
        </span>
      </div>
    </Link>
  );
}
