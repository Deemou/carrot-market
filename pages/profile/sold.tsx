import type { NextPage } from 'next';
import Item from '@components/item';
import ProductList from '@components/product-list';

const Sold: NextPage = () => {
  return (
    <div className="flex flex-col space-y-5 divide-y  pb-10">
      <ProductList kind="Sale" />
    </div>
  );
};

export default Sold;
