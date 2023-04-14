import type { NextPage } from 'next';
import ProductList from '@components/product-list';
import Layout from '@/components/layout';

const Sold: NextPage = () => {
  return (
    <Layout seoTitle="Products Sold">
      <ProductList kind="Sale" />
    </Layout>
  );
};

export default Sold;
