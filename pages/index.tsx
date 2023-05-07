import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import FloatingButton from '@components/floating-button';
import Item from '@components/item';
import { Product } from '@prisma/client';
import Layout from '@/components/layout';
import useInfiniteScroll from '@/libs/client/useInfiniteScroll';
import useSWRInfinite from 'swr/infinite';
import { useEffect } from 'react';
import client from '@/libs/server/client';

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
const requestUrl = '/api/products';
const getKey = (pageIndex: number, previousPageData: ProductsResponse) => {
  if (pageIndex === 0) return `${requestUrl}?page=1`;
  if (pageIndex + 1 > previousPageData.lastPage) return null;
  return `${requestUrl}?page=${pageIndex + 1}`;
};
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home: NextPage<ProductsResponse> = (props) => {
  const { data, setSize } = useSWRInfinite<ProductsResponse>(getKey, fetcher, {
    fallbackData: [props]
  });

  const page = useInfiniteScroll();
  useEffect(() => {
    void setSize(page);
  }, [setSize, page]);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Layout seoTitle="Home">
        <FloatingButton href="/products/upload">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
        <div className="mt-16 flex flex-col space-y-5 divide-y-[1px]">
          {data?.map((productsPage) => {
            return productsPage.products?.map((product) => (
              <Item
                id={product.id}
                key={product.id}
                title={product.name}
                price={product.price}
                image={product.image}
                hearts={product._count.favs}
              />
            ));
          })}
        </div>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  console.log('BUILDING HOME. STATICALLY');
  const limit = 10;
  const productQueries = await client.product.findMany({
    take: limit,
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
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      products: JSON.parse(JSON.stringify(products))
    }
  };
};

export default Home;
