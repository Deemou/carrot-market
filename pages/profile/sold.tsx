import type { NextPage, NextPageContext } from 'next';
import Layout from '@/components/layout';
import client from '@/libs/server/client';
import { Kind } from '@prisma/client';
import { ProductWithCount } from 'pages';
import Item from '@/components/item';
import { getSession } from 'next-auth/react';

interface Record {
  id: number;
  product: ProductWithCount;
}

interface ProductListResponse {
  ok: boolean;
  products: Record[];
}

const Sold: NextPage<ProductListResponse> = ({ products }) => {
  return (
    <Layout seoTitle="Products Sold">
      <div className="space-y-5 divide-y pb-10">
        {products?.map((record) => (
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
    </Layout>
  );
};

export const getServerSideProps = async function (ctx: NextPageContext) {
  const session = await getSession(ctx);
  const userId = Number(session?.user?.id);
  const kind = 'Sale';

  const recordQueries = await client.record.findMany({
    where: {
      userId,
      kind: kind as Kind
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      product: {
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
      }
    }
  });
  const products = recordQueries?.map((record) => {
    return {
      ...record,
      product: {
        ...record.product,
        _count: { favs: record.product._count.records }
      }
    };
  });
  return {
    props: {
      products: JSON.parse(JSON.stringify(products))
    }
  };
};

export default Sold;
