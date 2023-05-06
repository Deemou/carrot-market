import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import ProductForm from '@/components/form/product-form';

const Edit: NextPage = () => {
  const router = useRouter();
  const requestUrl = `/api/products/${router.query.id}/edit`;

  return (
    <Layout seoTitle="Upload Product">
      <ProductForm buttonText="Update" requestUrl={requestUrl} />
    </Layout>
  );
};

export default Edit;
