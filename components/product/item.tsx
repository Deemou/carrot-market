import Image from 'next/image';
import Link from 'next/link';
import EmptyHeartIcon from '../icon/empty-heart-icon';

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
              <div className="flex items-center justify-between space-x-0.5">
                <EmptyHeartIcon />
                <span>{likesCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
