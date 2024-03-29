import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Layout from '@/components/common/layout';
import SearchBar from '@/components/search/search-bar';
import ProductListSection from '@/components/product/product-list-section';
import PaginationBar from '@/components/pagination/pagination-bar';
import { useSetRecoilState } from 'recoil';
import { pageTypeAtom } from '@/atoms';
import { ProductsResponse } from '@/types/product';
import { PRODUCTS } from '@/pageTypes';

const ProductSearch: NextPage = () => {
  const router = useRouter();
  const { q } = router.query;
  const [page, setPage] = useState<number>(1);
  const { data } = useSWR<ProductsResponse>(
    q ? `/api/${PRODUCTS}/search?q=${q}&page=${page}` : null
  );
  const setPageType = useSetRecoilState(pageTypeAtom);

  useEffect(() => {
    setPageType(PRODUCTS);
  }, [setPageType]);

  useEffect(() => {
    if (router?.query?.page) setPage(+router.query.page);
    else setPage(1);
  }, [page, router]);

  return (
    <Layout seoTitle="ProductSearch">
      <SearchBar />
      {data?.ok && (
        <>
          <ProductListSection products={data.products} />
          <PaginationBar currentPage={page} lastPage={data.lastPage} />
        </>
      )}
      {!data?.ok && (
        <div className="mt-40">
          <h3 className="text-center">No results found</h3>
        </div>
      )}
    </Layout>
  );
};

export default ProductSearch;
