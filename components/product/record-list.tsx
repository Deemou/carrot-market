import { IRecordList } from '@/types/product';
import Item from './item';

export default function RecordList({ records }: IRecordList) {
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
