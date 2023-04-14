import type { NextPage } from 'next';
import ProductList from '@components/product-list';
import Layout from '@/components/layout';

const Loved: NextPage = () => {
  return (
    <Layout seoTitle="Products Loved">
      <ProductList kind="Fav" />
    </Layout>
  );
};

export default Loved;
