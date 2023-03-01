import type { NextPage } from 'next';
import Item from '@components/item';
import ProductList from '@components/product-list';

const Bought: NextPage = () => {
  return (
    <div className="flex flex-col space-y-5 divide-y  pb-10">
      <ProductList kind="Purchase" />
    </div>
  );
};

export default Bought;
