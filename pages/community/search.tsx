import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Post, User } from '@prisma/client';
import Layout from '@/components/layout';
import PaginationBar from '@/components/pagination-bar';
import SearchBar from '@/components/search-bar';

interface PostWithUser extends Post {
  user: User;
  _count: {
    wonderings: number;
    answers: number;
  };
}
interface PostsResponse {
  ok: boolean;
  posts: PostWithUser[];
  lastPage: number;
}

const CommunitySearch: NextPage = () => {
  const router = useRouter();
  const { q } = router.query;
  const [page, setPage] = useState<number>(1);
  const { data } = useSWR<PostsResponse>(
    q ? `/api/posts/search?q=${q}&page=${page}` : null
  );

  useEffect(() => {
    if (router?.query?.page) {
      setPage(+router.query.page);
    }
  }, [page, router]);

  return (
    <Layout seoTitle="CommunitySearch">
      <SearchBar section="community" />
      <h3 className="mb-4 mt-28">Results for : {q}</h3>
      <div className="flex flex-col space-y-5 divide-y-[1px]">
        {data &&
          data.posts.map((post) => (
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
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
                <span className="flex items-center space-x-2">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
        {!data?.ok && (
          <div className="mt-10">
            <h3 className="text-center">No results found</h3>
          </div>
        )}
        {data?.ok && (
          <PaginationBar currentPage={page} lastPage={data.lastPage} />
        )}
      </div>
    </Layout>
  );
};

export default CommunitySearch;
