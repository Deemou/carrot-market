import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '@/components/common/layout';
import ProductForm from '@/components/product/product-form';

const Edit: NextPage = () => {
  const router = useRouter();
  const requestUrl = `/api/products/${router.query.id}/edit`;

  return (
    <Layout seoTitle="Edit Product">
      <ProductForm buttonText="Update" requestUrl={requestUrl} />
    </Layout>
  );
};

export default Edit;
