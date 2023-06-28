import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Post, User } from '@prisma/client';
import Layout from '@/components/layout';
import SearchBar from '@/components/search-bar';
import PostListSection from '@/components/section/post-list-section';
import PaginationBar from '@/components/pagination-bar';

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
      {data && <PostListSection posts={data.posts} />}
      {data && !data?.ok && (
        <div className="mt-40">
          <h3 className="text-center">No results found</h3>
        </div>
      )}
      {data?.ok && (
        <PaginationBar currentPage={page} lastPage={data.lastPage} />
      )}
    </Layout>
  );
};

export default CommunitySearch;
