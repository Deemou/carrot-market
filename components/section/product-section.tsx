import { Product } from '@prisma/client';
import Item from '@components/item';

export interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

interface ProductSectionProps {
  products: ProductWithCount[];
}

export default function ProductSection({ products }: ProductSectionProps) {
  return (
    <div className="mt-24 space-y-4 divide-y-[2px]">
      {products?.map((product) => (
        <Item
          id={product.id}
          key={product.id}
          name={product.name}
          price={product.price}
          thumbImage={product.thumbImage || product.image}
          hearts={product._count.favs}
        />
      ))}
    </div>
  );
}
