import Item from '@/components/product/item';
import { ProductWithCount } from '@/types/product';

interface ProductListSectionProps {
  products: ProductWithCount[];
}

export default function ProductListSection({
  products
}: ProductListSectionProps) {
  return (
    <div className="mt-24 space-y-4 divide-y-[2px]">
      {products.map((product) => (
        <Item
          id={product.id}
          key={product.id}
          name={product.name}
          price={product.price}
          thumbImage={product.thumbImage || product.image}
          likesCount={product._count.favs}
        />
      ))}
    </div>
  );
}
