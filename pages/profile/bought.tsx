import type { NextPage } from 'next';
import ProductList from '@components/product-list';
import Layout from '@/components/layout';

const Bought: NextPage = () => {
  return (
    <Layout seoTitle="Products Bought">
      <ProductList kind="Purchase" />
    </Layout>
  );
};

export default Bought;
