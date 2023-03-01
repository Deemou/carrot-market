import type { NextPage } from 'next';
import Item from '@components/item';
import ProductList from '@components/product-list';

const Loved: NextPage = () => {
  return (
    <div className="flex flex-col space-y-5 divide-y  pb-10">
      <ProductList kind="Fav" />
    </div>
  );
};

export default Loved;
