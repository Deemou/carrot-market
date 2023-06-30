import Image from 'next/image';
import Link from 'next/link';

interface ItemProps {
  id: number;
  name: string;
  price: number;
  thumbImage: string;
  likesCount: number;
}

export default function Item({
  id,
  name,
  price,
  thumbImage,
  likesCount
}: ItemProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="flex cursor-pointer justify-between pt-5"
    >
      <div className="flex w-full justify-between space-x-4">
        <div className="relative aspect-square h-24 shrink-0">
          <Image
            src={thumbImage}
            alt="product"
            fill
            sizes="50vw"
            priority
            className="object-center"
          />
        </div>
        <div className="flex w-10/12 flex-col justify-between max-w640:w-9/12 max-w480:w-8/12">
          <h3 className="overflow-hidden">{name}</h3>
          <div className="flex justify-between">
            <span>${price}</span>
            <div className="flex items-end justify-end space-x-2">
              <div className="flex items-center justify-between space-x-0.5 text-red-700">
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
                <span>{likesCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
