import type { NextPage } from 'next';
import Layout from '@/components/common/layout';
import PostForm from '@/components/community/post-form';

const Write: NextPage = () => {
  const requestUrl = '/api/community';

  return (
    <Layout seoTitle="Write Post">
      <PostForm buttonText="Upload" requestUrl={requestUrl} />
    </Layout>
  );
};

export default Write;
