import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Product } from '@prisma/client';
import Layout from '@/components/layout';
import SearchBar from '@/components/search-bar';
import ProductSection from '@/components/section/product-section';
import PaginationBar from '@/components/pagination-bar';

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
      {data && <ProductSection products={data.products} />}
      {!data?.ok && (
        <div className="mt-40">
          <h3 className="text-center">No results found</h3>
        </div>
      )}
      {data?.ok && (
        <PaginationBar currentPage={page} lastPage={data.lastPage} />
      )}
    </Layout>
  );
};

export default ProductSearch;
