import type { NextPage } from 'next';
import Item from '@components/item';
import ProductList from '@components/product-list';
import Layout from '@/components/layout';

const Sold: NextPage = () => {
  return (
    <Layout seoTitle="Products Sold">
      <div className="flex flex-col space-y-5 divide-y  pb-10">
        <ProductList kind="Sale" />
      </div>
    </Layout>
  );
};

export default Sold;
