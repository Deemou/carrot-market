import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Post, User } from '@prisma/client';
import Layout from '@/components/common/layout';
import SearchBar from '@/components/search/search-bar';
import PostListSection from '@/components/community/post-list-section';
import PaginationBar from '@/components/pagination/pagination-bar';

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
    if (router?.query?.page) setPage(+router.query.page);
    else setPage(1);
  }, [page, router]);

  return (
    <Layout seoTitle="CommunitySearch">
      <SearchBar section="community" />
      {data?.ok && (
        <>
          <PostListSection posts={data.posts} />
          <PaginationBar currentPage={page} lastPage={data.lastPage} />
        </>
      )}
      {!data?.ok && (
        <div className="mt-40">
          <h3 className="text-center">No results found</h3>
        </div>
      )}
    </Layout>
  );
};

export default CommunitySearch;
