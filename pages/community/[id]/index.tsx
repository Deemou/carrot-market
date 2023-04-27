/* eslint-disable react/button-has-type */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Answer, Post, User } from '@prisma/client';
import useMutation from '@libs/client/useMutation';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import cls from '@libs/client/utils';
import Layout from '@/components/layout';
import TextArea from '@components/textarea';
import client from '@/libs/server/client';
import Avatar from '@/components/avatar';
import Card from '@/components/profile/card';

interface AnswerWithUser extends Answer {
  user: User;
}

interface PostWithUser extends Post {
  user: User;
  _count: {
    answers: number;
    wonderings: number;
  };
  answers: AnswerWithUser[];
}

interface CommunityPostResponse {
  ok: boolean;
  post: PostWithUser;
  isWondering: boolean;
}

interface AnswerForm {
  answer: string;
}

interface AnswerResponse {
  ok: boolean;
  response: Answer;
}

const CommunityPostDetail: NextPage<CommunityPostResponse> = (props) => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<AnswerForm>();
  const { data, mutate } = useSWR<CommunityPostResponse>(
    `/api/posts/${router.query.id}`,
    {
      fallbackData: props
    }
  );
  const [toggleWonder, { loading }] = useMutation(
    `/api/posts/${router.query.id}/wonder`
  );
  const [sendAnswer, { data: answerData, loading: answerLoading }] =
    useMutation<AnswerResponse>(`/api/posts/${router.query.id}/answers`);

  const onWonderClick = () => {
    if (!data) return;
    void mutate(
      {
        ...data,
        post: {
          ...data.post,
          _count: {
            ...data.post._count,
            wonderings: data.isWondering
              ? data?.post._count.wonderings - 1
              : data?.post._count.wonderings + 1
          }
        },
        isWondering: !data.isWondering
      },
      false
    );
    if (!loading) {
      toggleWonder({});
    }
  };
  const onValid = (form: AnswerForm) => {
    if (answerLoading) return;
    sendAnswer(form);
  };
  useEffect(() => {
    if (answerData && answerData.ok) {
      reset();
      void mutate();
    }
  }, [answerData, reset, mutate]);
  return (
    <Layout seoTitle="Community Post Detail">
      {data && (
        <div className="px-4">
          <span className="my-3 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            동네질문
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
              <span className="font-medium text-orange-500">Q.</span>{' '}
              {data.post.question}
            </div>
            <div className="mt-3 flex w-full space-x-5 border-t border-b-[2px] py-2.5  text-gray-700">
              <button
                onClick={onWonderClick}
                className={cls(
                  'flex items-center space-x-2 text-sm',
                  data.isWondering ? 'text-teal-600' : ''
                )}
              >
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
                <span>궁금해요 {data.post._count.wonderings}</span>
              </button>
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
                <span>답변 {data.post._count.answers}</span>
              </span>
            </div>
          </div>
          <div className="my-5 space-y-5">
            {data.post.answers.map((answer) => (
              <div key={answer.id} className="flex items-start space-x-3">
                <Avatar url={answer.user.avatar} />
                <div>
                  <span className="block text-sm font-medium">
                    {answer.user.name}
                  </span>
                  <span className="block text-xs ">
                    {answer.createdAt.toString().slice(0, 10)}
                  </span>
                  <p className="mt-2">{answer.answer} </p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={(...args) => void handleSubmit(onValid)(...args)}>
            <TextArea
              name="description"
              placeholder="Answer this question!"
              required
              register={register('answer', { required: true, minLength: 5 })}
            />
            <button className="mt-2 w-full rounded-md border border-transparent bg-orange-500 py-2 px-4 text-sm font-medium  shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ">
              {answerLoading ? 'Loading...' : 'Reply'}
            </button>
          </form>
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      post: JSON.parse(JSON.stringify(post))
    }
  };
};

export default CommunityPostDetail;
