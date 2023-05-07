import { ProductWithCount } from 'pages';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import Item from '@components/item';

interface ProductListProps {
  kind: 'Fav' | 'Sale' | 'Purchase';
}

interface Record {
  id: number;
  product: ProductWithCount;
}

interface ProductListResponse {
  ok: boolean;
  products: Record[];
}

export default function ProductList({ kind }: ProductListProps) {
  const router = useRouter();

  const requestUrl = router.query.id
    ? `/api/users/records?kind=${kind}&id=${router.query.id}`
    : `/api/users/records?kind=${kind}`;

  const { data } = useSWR<ProductListResponse>(requestUrl);
  return data ? (
    <div className="space-y-5 divide-y pb-10">
      {data?.products?.map((record) => (
        <Item
          id={record.product.id}
          key={record.id}
          name={record.product.name}
          price={record.product.price}
          image={record.product.image}
          hearts={record.product._count.favs}
        />
      ))}
    </div>
  ) : null;
}
