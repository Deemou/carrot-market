import Link from 'next/link';
import { Post, User } from '@prisma/client';
import CheckIcon from '../icon/check-icon';
import MessageIcon from '../icon/message-icon';

interface PostWithUser extends Post {
  user: User;
  _count: {
    wonderings: number;
    answers: number;
  };
}

interface PostListSectionProps {
  posts: PostWithUser[];
}

export default function PostListSection({ posts }: PostListSectionProps) {
  return (
    <div className="mt-24 space-y-4 divide-y-[2px]">
      {posts.map((post) => (
        <Link
          href={`/community/${post.id}`}
          key={post.id}
          className="flex cursor-pointer flex-col items-start pt-4"
        >
          <span className="flex items-center rounded-full bg-gray-100 px-2.5 text-gray-800">
            Question
          </span>
          <div className="mt-2">
            <span className="text-orange-500">Q.</span> {post.question}
          </div>
          <div className="mt-5 flex w-full items-center justify-between text-gray-500">
            <span>{post.user.name}</span>
            <span>{post.createdAt.toString().slice(0, 10)}</span>
          </div>
          <div className="mt-3 flex w-full space-x-5 border-t py-2.5 text-gray-700">
            <span className="flex items-center space-x-2">
              <CheckIcon />
              <span>궁금해요 {post._count?.wonderings}</span>
            </span>
            <span className="flex items-center space-x-2">
              <MessageIcon />
              <span>답변 {post._count?.answers}</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
