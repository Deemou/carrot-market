import type { NextPage } from 'next';
import Layout from '@/components/layout';
import ProductForm from '@/components/form/product-form';

const Upload: NextPage = () => {
  const requestUrl = '/api/products';

  return (
    <Layout seoTitle="Upload Product">
      <ProductForm buttonText="Upload" requestUrl={requestUrl} />
    </Layout>
  );
};

export default Upload;
