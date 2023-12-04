import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import useMutation from '@libs/client/useMutation';
import Layout from '@/components/common/layout';
import client from '@/libs/server/client';
import Avatar from '@/components/common/avatar';
import Card from '@/components/profile/card';
import WonderButton from '@/components/community/wonder-button';
import MessageIcon from '@/components/icon/message-icon';
import AnswerForm from '@/components/community/answer-form';
import { CommunityPostResponse } from '@/types/community';

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
          <div>
            <div className="mt-2">
              <span className="text-orange-500">Q.</span> {data.post.question}
            </div>
            <div className="mt-3 flex w-full space-x-5 border-b-[2px] border-t py-2.5  text-gray-700">
              <WonderButton
                onWonderClick={onWonderClick}
                isWondering={data.isWondering}
                wondersCount={data.post._count.wonderings}
              />
              <div className="flex items-center space-x-2">
                <MessageIcon />
                <span>답변 {data.post._count.answers}</span>
              </div>
            </div>
          </div>
          <div className="my-5 space-y-5">
            {data.post.answers.map((answer) => (
              <div key={answer.id} className="flex items-start space-x-3">
                <Avatar url={answer.user.avatar} />
                <div>
                  <div className="flex flex-col">
                    <span>{answer.user.name}</span>
                    <span>{answer.createdAt.toString().slice(0, 10)}</span>
                  </div>

                  <span className="mt-2">{answer.answer} </span>
                </div>
              </div>
            ))}
          </div>

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
