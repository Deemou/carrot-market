import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '@/components/common/layout';
import ProductForm from '@/components/product/product-form';
import { PRODUCTS } from '@/pageTypes';

const Edit: NextPage = () => {
  const router = useRouter();
  const requestUrl = `/api/${PRODUCTS}/${router.query.id}/edit`;

  return (
    <Layout seoTitle="Edit Product">
      <ProductForm buttonText="Update" requestUrl={requestUrl} />
    </Layout>
  );
};

export default Edit;
