import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Post, User } from '@prisma/client';
import Layout from '@/components/layout';
import PaginationBar from '@/components/pagination-bar';
import SearchBar from '@/components/search-bar';
import PostSection from '@/components/section/post-section';

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
      <h3 className="mt-28">Results for : {q}</h3>
      {data?.ok && <PostSection posts={data.posts}></PostSection>}
      {data && !data.ok && (
        <div className="mt-10">
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
