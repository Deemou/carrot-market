import type { NextPage } from 'next';
import Item from '@components/item';
import ProductList from '@components/product-list';
import Layout from '@/components/layout';

const Loved: NextPage = () => {
  return (
    <Layout>
      <div className="flex flex-col space-y-5 divide-y  pb-10">
        <ProductList kind="Fav" />
      </div>
    </Layout>
  );
};

export default Loved;
