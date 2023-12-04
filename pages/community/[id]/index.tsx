import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import useMutation from '@libs/client/useMutation';
import Layout from '@/components/common/layout';
import client from '@/libs/server/client';
import Card from '@/components/profile/card';
import AnswerForm from '@/components/community/answer-form';
import { CommunityPostResponse } from '@/types/community';
import AnswerList from '@/components/community/answer-list';
import PostInfoBar from '@/components/community/post-info-bar';
import Question from '@/components/community/question';

const CommunityPostDetail: NextPage<CommunityPostResponse> = (props) => {
  const router = useRouter();
  const requestUrl = `/api/posts/${router.query.id}`;
  const buttonText = 'Reply';
  const { data, mutate } = useSWR<CommunityPostResponse>(requestUrl, {
    fallbackData: props
  });
  const [toggleWonder, { loading }] = useMutation(`${requestUrl}/wonder`);

  const onWonderClick = () => {
    if (!data) return;
    if (!loading) {
      toggleWonder({});
      mutate(
        {
          ...data,
          post: {
            ...data.post,
            _count: {
              ...data.post._count,
              wonderings: data.isWondering
                ? data.post._count.wonderings - 1
                : data.post._count.wonderings + 1
            }
          },
          isWondering: !data.isWondering
        },
        false
      );
    }
  };

  return (
    <Layout seoTitle="Community Post Detail">
      {data && (
        <div className="px-4">
          <span className="my-3 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-gray-800">
            Question
          </span>
          <Card
            avatar={data.post.user.avatar}
            userId={data.post.user.id}
            userName={data.post.user.name}
            postType="posts"
            postId={data.post.id}
          ></Card>
          <Question question={data.post.question} />
          <PostInfoBar
            onWonderClick={onWonderClick}
            isWondering={data.isWondering}
            wondersCount={data.post._count.wonderings}
            answersCount={data.post._count.answers}
          />
          <AnswerList answers={data.post.answers} />
          <AnswerForm
            requestUrl={requestUrl}
            buttonText={buttonText}
            mutate={mutate}
          />
        </div>
      )}
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  console.log('BUILDING POST DETAIL. STATICALLY');
  const id = Number(ctx.params?.id);
  if (!id) {
    return {
      notFound: true
    };
  }
  const post = await client.post.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      },
      answers: {
        select: {
          answer: true,
          id: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      },
      _count: {
        select: {
          answers: true,
          wonderings: true
        }
      }
    }
  });
  if (!post) {
    return {
      notFound: true
    };
  }
  return {
    props: {
      post: JSON.parse(JSON.stringify(post))
    }
  };
};

export default CommunityPostDetail;
