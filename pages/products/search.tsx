import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Product } from '@prisma/client';
import Item from '@components/item';
import Layout from '@/components/layout';
import PaginationBar from '@/components/pagination-bar';
import SearchBar from '@/components/search-bar';

export interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

interface ProductsResponse {
  ok: boolean;
  products: ProductWithCount[];
  lastPage: number;
}

const ProductSearch: NextPage = () => {
  const router = useRouter();
  const { q } = router.query;
  const [page, setPage] = useState<number>(1);
  const { data } = useSWR<ProductsResponse>(
    q ? `/api/products/search?q=${q}&page=${page}` : null
  );

  useEffect(() => {
    if (router?.query?.page) {
      setPage(+router.query.page);
    }
  }, [page, router]);

  return (
    <Layout seoTitle="ProductSearch">
      <SearchBar section="products" />
      <h3 className="mb-4 mt-28">Results for : {q}</h3>
      <div className="flex flex-col space-y-5 divide-y-[1px]">
        {data?.products?.map((product) => (
          <Item
            id={product.id}
            key={product.id}
            name={product.name}
            price={product.price}
            thumbImage={product.thumbImage || product.image}
            hearts={product._count.favs}
          />
        ))}
        {!data?.ok && (
          <div className="mt-10">
            <h3 className="text-center">No results found</h3>
          </div>
        )}
        {data?.ok && (
          <PaginationBar currentPage={page} lastPage={data.lastPage} />
        )}
      </div>
    </Layout>
  );
};

export default ProductSearch;
