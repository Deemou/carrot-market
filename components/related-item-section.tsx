import { Product } from '@prisma/client';
import Slider from './slider';

interface RelatedItemSectionProps {
  relatedProducts: Product[];
}

export default function RelatedItemSection({
  relatedProducts
}: RelatedItemSectionProps) {
  return (
    relatedProducts && (
      <Slider
        maxLength={950}
        type="product"
        title="이런 상품은 어떠세요?"
        list={relatedProducts}
      />
    )
  );
}
