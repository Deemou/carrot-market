import { Product } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

interface RelatedItemSectionProps {
  relatedProducts: Product[];
}

export default function RelatedItemSection({
  relatedProducts
}: RelatedItemSectionProps) {
  return (
    <div>
      <h3>Related items</h3>
      <div className="mt-6 grid grid-cols-3 gap-10 max-w640:grid-cols-2 max-w320:grid-cols-1">
        {relatedProducts.map((product) => (
          <div key={product.id}>
            <Link href={`/products/${product.id}`} className="cursor-pointer">
              <div className="max-w-[256px]">
                <div className="relative mb-4 aspect-square">
                  <Image
                    src={product.image}
                    alt="product"
                    fill
                    sizes="50vw"
                    priority
                    className="object-center"
                  />
                </div>
                <div className="flex flex-col">
                  <span>{product.name}</span>
                  <span className="mt-1">${product.price}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
