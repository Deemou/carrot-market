import { ProductWithCount } from '@/pages';
import Item from './item';

interface Record {
  id: number;
  product: ProductWithCount;
}

interface RecordListProps {
  records: Record[];
}

export default function RecordList({ records }: RecordListProps) {
  return (
    <div className="space-y-5 divide-y pb-10">
      {records.map((record) => (
        <Item
          id={record.product.id}
          key={record.id}
          name={record.product.name}
          price={record.product.price}
          thumbImage={record.product.thumbImage || record.product.image}
          likesCount={record.product._count.favs}
        />
      ))}
    </div>
  );
}
