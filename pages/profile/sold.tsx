import type { NextPage, NextPageContext } from 'next';
import client from '@/libs/server/client';
import { Kind } from '@prisma/client';
import { ProductWithCount } from 'pages';
import { getSession } from 'next-auth/react';
import Layout from '@/components/layout';
import RecordList from '@/components/record-list';

interface Record {
  id: number;
  product: ProductWithCount;
}

interface RecordListResponse {
  ok: boolean;
  records: Record[];
}

const Sold: NextPage<RecordListResponse> = ({ records }) => {
  return (
    <Layout seoTitle="Record Sale">
      <RecordList records={records} />
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
  const records = recordQueries?.map((record) => {
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
      records: JSON.parse(JSON.stringify(records))
    }
  };
};

export default Sold;
