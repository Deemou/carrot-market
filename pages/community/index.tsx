import type { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import { Post, User } from '@prisma/client';
import client from '@libs/server/client';
import Layout from '@/components/layout';
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
  posts: PostWithUser[];
}

const Community: NextPage<PostsResponse> = (props) => {
  const { data } = useSWR<PostsResponse>('/api/posts', {
    fallbackData: props
  });

  return (
    <Layout seoTitle="Community">
      <SearchBar section="community" />
      {data && <PostSection posts={data.posts} />}
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
