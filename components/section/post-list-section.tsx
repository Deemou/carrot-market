import { Post, User } from '@prisma/client';
import PostItem from '../post-item';

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
        <PostItem
          key={post.id}
          id={post.id}
          question={post.question}
          createdAt={post.createdAt}
          author={post.user.name}
          wonderings={post._count.wonderings}
          answers={post._count.answers}
        />
      ))}
    </div>
  );
}
