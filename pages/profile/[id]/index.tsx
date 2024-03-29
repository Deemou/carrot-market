import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { User } from '@prisma/client';
import Layout from '@/components/common/layout';
import Tab from '@/components/profile/tab';
import Avatar from '@/components/common/avatar';
import client from '@/libs/server/client';
import CartIcon from '@/components/icon/cart-icon';
import { PROFILE_URL } from '@/routes';

const Profile: NextPage<{ profile: User }> = ({ profile }) => {
  return (
    <Layout seoTitle="Profile">
      <div className="px-4">
        <div className="mt-4 flex items-center space-x-3">
          <Avatar url={profile.avatar} />
          <div className="flex h-12 items-center">
            <h4>{profile.name}</h4>
          </div>
        </div>
        <div className="mt-10 flex justify-around">
          <Tab href={`${PROFILE_URL}/${profile.id}/sale`} text="판매중인 상품">
            <CartIcon />
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
      profile: JSON.parse(JSON.stringify(profile))
    }
  };
};

export default Profile;
