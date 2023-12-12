import { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@prisma/client';
import { PRODUCTS } from '@/pageTypes';

interface CustomCSSProperties extends CSSProperties {
  '--offset'?: string;
}

interface ProductSlideProps {
  offset: number;
  product: Product;
}

export default function ProductSlide({ offset, product }: ProductSlideProps) {
  return (
    <motion.div
      transition={{ type: 'tween' }}
      layoutId={product.id.toString()}
      className="slide"
      style={{ '--offset': `${offset}` } as CustomCSSProperties}
    >
      <Link href={`/${PRODUCTS}/${product.id}`}>
        <div>
          <div className="relative mb-4 aspect-square w-full">
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
            <div className="h-[42px] overflow-hidden">
              <span>{product.name}</span>
            </div>
            <span className="mt-1">${product.price}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
