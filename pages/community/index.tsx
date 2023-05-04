/* eslint-disable no-void */
/* eslint-disable no-underscore-dangle */
import type { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import { Post, User } from '@prisma/client';
import client from '@libs/server/client';
import Layout from '@/components/layout';
import FloatingButton from '@components/floating-button';

interface PostWithUser extends Post {
  user: User;
  _count: {
    wonderings: number;
    answers: number;
  };
}

interface PostsResponse {
  posts: PostWithUser[];
}

const Community: NextPage<PostsResponse> = (props) => {
  const { data } = useSWR<PostsResponse>('/api/posts', {
    fallbackData: props
  });

  return (
    <Layout seoTitle="Community">
      <FloatingButton href="/community/write">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          ></path>
        </svg>
      </FloatingButton>
      <div className="mt-16 space-y-4 divide-y-[2px]">
        {data &&
          data.posts.map((post) => (
            <Link
              key={post.id}
              href={`/community/${post.id}`}
              className="flex cursor-pointer flex-col items-start pt-4"
            >
              <span className="flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                Question
              </span>
              <div className="mt-2">
                <span className="font-medium text-orange-500">Q.</span>{' '}
                {post.question}
              </div>
              <div className="mt-5 flex w-full items-center justify-between text-xs font-medium text-gray-500">
                <span>{post.user.name}</span>
                <span>{post.createdAt.toString().slice(0, 10)}</span>
              </div>
              <div className="mt-3 flex w-full space-x-5 border-t px-4 py-2.5   text-gray-700">
                <span className="flex items-center space-x-2 text-sm">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>궁금해요 {post._count?.wonderings}</span>
                </span>
                <span className="flex items-center space-x-2 text-sm">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                  </svg>
                  <span>답변 {post._count?.answers}</span>
                </span>
              </div>
            </Link>
          ))}
      </div>
    </Layout>
  );
};

export async function getStaticProps() {
  console.log('BUILDING COMM. STATICALLY');
  const posts = await client.post.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      },
      _count: {
        select: {
          wonderings: true,
          answers: true
        }
      }
    }
  });
  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      posts: JSON.parse(JSON.stringify(posts))
    }
  };
}

export default Community;
