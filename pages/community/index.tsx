import type { NextPage, NextPageContext } from 'next';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { Post, User } from '@prisma/client';
import client from '@libs/server/client';
import Layout from '@/components/common/layout';
import SearchBar from '@/components/search/search-bar';
import PostListSection from '@/components/community/post-list-section';
import { useRouter } from 'next/router';
import PaginationBar from '@/components/pagination/pagination-bar';
import { useSetRecoilState } from 'recoil';
import { pageTypeAtom } from '@/atoms';

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

const Community: NextPage<PostsResponse> = (props) => {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const pageType = 'community';
  const { data } = useSWR<PostsResponse>(`/api/${pageType}?page=${page}`, {
    fallbackData: props
  });
  const setPageType = useSetRecoilState(pageTypeAtom);

  useEffect(() => {
    setPageType(pageType);
  }, [setPageType]);

  useEffect(() => {
    if (router?.query?.page) setPage(+router.query.page);
    else setPage(1);
  }, [page, router]);

  return (
    <Layout seoTitle="Community">
      <SearchBar />
      {data?.ok && (
        <>
          <PostListSection posts={data.posts} />
          <PaginationBar currentPage={page} lastPage={data.lastPage} />
        </>
      )}
    </Layout>
  );
};

export const getServerSideProps = async function (ctx: NextPageContext) {
  const page = Number(ctx.query.page) || 1;
  const limit = 10;
  const posts = await client.post.findMany({
    take: limit,
    skip: (page - 1) * limit,
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
      posts: JSON.parse(JSON.stringify(posts))
    }
  };
};

export default Community;
