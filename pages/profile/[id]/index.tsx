/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { User } from '@prisma/client';
import Layout from '@/components/layout';
import Tab from '@/components/profile/tab';
import Avatar from '@/components/avatar';
import client from '@/libs/server/client';

const Profile: NextPage<{ profile: User }> = ({ profile }) => {
  return (
    <Layout seoTitle="Profile">
      <div className="px-4">
        <div className="mt-4 flex items-center space-x-3">
          <Avatar url={profile.avatar} />
          <div className="flex flex-col">
            <span className="font-medium ">{profile.name}</span>
          </div>
        </div>
        <div className="mt-10 flex justify-around">
          <Tab href={`/profile/${profile.id}/sold`} text="판매중인 상품">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
          </Tab>
        </div>
      </div>
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
  const id = Number(ctx.params?.id);
  if (!id) {
    return {
      notFound: true
    };
  }
  const profile = await client.user.findUnique({
    where: { id }
  });
  if (!profile) {
    return {
      notFound: true
    };
  }
  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      profile: JSON.parse(JSON.stringify(profile))
    }
  };
};

export default Profile;
