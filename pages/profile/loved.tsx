import type { NextPage, NextPageContext } from 'next';
import Layout from '@/components/layout';
import { withSsrSession } from '@/libs/server/withSession';
import client from '@/libs/server/client';
import { Kind } from '@prisma/client';
import { ProductWithCount } from 'pages';
import Item from '@/components/item';

interface Record {
  id: number;
  product: ProductWithCount;
}

interface ProductListResponse {
  ok: boolean;
  products: Record[];
}

const Loved: NextPage<ProductListResponse> = ({ products }) => {
  return (
    <Layout seoTitle="Products Loved">
      <div className="space-y-5 divide-y pb-10">
        {products?.map((record) => (
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
    </Layout>
  );
};

export const getServerSideProps = withSsrSession(async function (
  ctx: NextPageContext
) {
  const userId = ctx.req?.session.user?.id;
  const kind = 'Fav';

  const recordQueries = await client.record.findMany({
    where: {
      userId,
      kind: kind as Kind
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      products: JSON.parse(JSON.stringify(products))
    }
  };
});

export default Loved;
