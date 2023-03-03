import type { NextPage } from 'next';
import Item from '@components/item';
import ProductList from '@components/product-list';
import Layout from '@/components/layout';

const Bought: NextPage = () => {
  return (
    <Layout seoTitle="Products Bought">
      <div className="flex flex-col space-y-5 divide-y  pb-10">
        <ProductList kind="Purchase" />
      </div>
    </Layout>
  );
};

export default Bought;
