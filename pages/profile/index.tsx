import type { NextPage, NextPageContext } from 'next';
import Link from 'next/link';
import { SWRConfig } from 'swr';
import { User } from '@prisma/client';
import Layout from '@/components/layout';
import Tab from '@/components/profile/tab';
import Avatar from '@/components/avatar';
import client from '@libs/server/client';
import { getSession, useSession } from 'next-auth/react';
import CartIcon from '@/components/icon/cart-icon';
import ShoppingBagIcon from '@/components/icon/shopping-bag-icon';
import FilledHeartIcon from '@/components/icon/filled-heart-icon';

const Profile: NextPage = () => {
  const { data: session } = useSession();

  return (
    <Layout seoTitle="Profile">
      <div className="px-4">
        <div className="mt-4 flex items-center space-x-3">
          <Avatar url={session?.user?.avatar} />
          <div className="flex h-12 flex-col justify-between">
            <h4>{session?.user?.name}</h4>
            <Link href="/profile/edit" className="text-gray-400">
              Edit profile &rarr;
            </Link>
          </div>
        </div>
        <div className="mt-10 flex">
          <Tab href="/profile/sale" text="판매중인 상품" className="w-1/3">
            <CartIcon />
          </Tab>
          <Tab href="/profile/bought" text="구매내역" className="w-1/3">
            <ShoppingBagIcon />
          </Tab>
          <Tab href="/profile/loved" text="관심목록" className="w-1/3">
            <FilledHeartIcon />
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

export const getServerSideProps = async function (ctx: NextPageContext) {
  const session = await getSession(ctx);

  const profile = await client.user.findUnique({
    where: { id: Number(session?.user?.id) }
  });
  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile))
    }
  };
};

export default Page;
