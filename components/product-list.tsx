/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-underscore-dangle */
import { ProductWithCount } from 'pages';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Item from './item';

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
    <div>
      {data?.products?.map((record) => (
        <Item
          id={record.product.id}
          key={record.id}
          title={record.product.name}
          price={record.product.price}
          image={record.product.image}
          hearts={record.product._count.favs}
        />
      ))}
    </div>
  ) : null;
}
