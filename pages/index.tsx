import type { GetStaticProps, NextPage } from 'next';
import Item from '@components/item';
import { Product } from '@prisma/client';
import Layout from '@/components/layout';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import client from '@/libs/server/client';
import SearchBar from '@/components/search-bar';
import { useRouter } from 'next/router';
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

const Home: NextPage<ProductsResponse> = (props) => {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const { data } = useSWR<ProductsResponse>(`/api/products?page=${page}`, {
    fallbackData: props
  });

  useEffect(() => {
    if (router?.query?.page) {
      setPage(+router.query.page);
    }
  }, [page, router]);

  return (
    <Layout seoTitle="Home">
      <SearchBar section="products" />
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
      </div>
      {data?.ok && (
        <PaginationBar currentPage={page} lastPage={data.lastPage} />
      )}
    </Layout>
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
