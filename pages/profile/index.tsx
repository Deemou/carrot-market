import type { NextPage, NextPageContext } from 'next';
import Link from 'next/link';
import useUser from '@libs/client/useUser';
import { SWRConfig } from 'swr';
import { User } from '@prisma/client';
import Layout from '@/components/layout';
import Tab from '@/components/profile/tab';
import Avatar from '@/components/avatar';
import { withSsrSession } from '@libs/server/withSession';
import client from '@libs/server/client';

const Profile: NextPage = () => {
  const { user } = useUser();
  return (
    <Layout seoTitle="Profile">
      <div className="px-4">
        <div className="mt-4 flex items-center space-x-3">
          <Avatar url={user?.avatar} />
          <div className="flex flex-col">
            <span className="font-medium ">{user?.name}</span>
            <Link href="/profile/edit" className="text-sm text-gray-400">
              Edit profile &rarr;
            </Link>
          </div>
        </div>
        <div className="mt-10 flex">
          <Tab href="/profile/sold" text="판매중인 상품" className="w-1/3">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
          </Tab>
          <Tab href="/profile/bought" text="구매내역" className="w-1/3">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
          </Tab>
          <Tab href="/profile/loved" text="관심목록" className="w-1/3">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </Tab>
        </div>
      </div>
    </Layout>
  );
};

const Page: NextPage<{ profile: User }> = ({ profile }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          '/api/users/me': { ok: true, profile }
        }
      }}
    >
      <Profile />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(async function (
  ctx: NextPageContext
) {
  const profile = await client.user.findUnique({
    where: { id: ctx.req?.session.user?.id }
  });
  return {
    props: {
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      profile: JSON.parse(JSON.stringify(profile))
    }
  };
});

export default Page;
