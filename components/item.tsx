import Image from 'next/image';
import Link from 'next/link';

interface ItemProps {
  id: number;
  name: string;
  price: number;
  image: string;
  hearts: number;
}

export default function Item({ id, name, price, image, hearts }: ItemProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="flex cursor-pointer justify-between pt-5"
    >
      <div className="flex h-24 space-x-4">
        <div className="relative aspect-square h-24 shrink-0">
          <Image
            src={image}
            alt="product"
            width={96}
            height={96}
            priority
            className="object-center"
          />
        </div>
        <div className="flex flex-col justify-between">
          <h3 className="h-14 overflow-hidden text-lg font-medium">{name}</h3>
          <span className="mt-1 font-medium">${price}</span>
        </div>
      </div>
      <div className="flex items-end justify-end space-x-2">
        <div className="flex items-center space-x-0.5 text-sm text-red-700">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
          <span>{hearts}</span>
        </div>
      </div>
    </Link>
  );
}
