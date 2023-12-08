import type { NextPage, NextPageContext } from 'next';
import { Product } from '@prisma/client';
import Layout from '@/components/common/layout';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import client from '@/libs/server/client';
import SearchBar from '@/components/search/search-bar';
import { useRouter } from 'next/router';
import ProductListSection from '@/components/product/product-list-section';
import PaginationBar from '@/components/pagination/pagination-bar';

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
import { useSetRecoilState } from 'recoil';
import { pageTypeAtom } from '@/atoms';

const Home: NextPage<ProductsResponse> = (props) => {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const { data } = useSWR<ProductsResponse>(`/api/products?page=${page}`, {
    fallbackData: props
  });
  const setPageType = useSetRecoilState(pageTypeAtom);
  setPageType('products');

  useEffect(() => {
    if (router?.query?.page) setPage(+router.query.page);
    else setPage(1);
  }, [page, router]);

  return (
    <Layout seoTitle="Home">
      <SearchBar />
      {data?.ok && (
        <>
          <ProductListSection products={data.products} />
          <PaginationBar currentPage={page} lastPage={data.lastPage} />
        </>
      )}
    </Layout>
  );
};

export const getServerSideProps = async function (ctx: NextPageContext) {
  const page = Number(ctx.query.page) || 1;
  const limit = 10;
  const productQueries = await client.product.findMany({
    take: limit,
    skip: (page - 1) * limit,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      _count: {
        select: {
          records: {
            where: {
              kind: { equals: 'Fav' }
            }
          }
        }
      }
    }
  });
  const products = productQueries.map((product) => {
    return { ...product, _count: { favs: product._count.records } };
  });
  return {
    props: {
      products: JSON.parse(JSON.stringify(products))
    }
  };
};

export default Home;
