import type { NextPage, NextPageContext } from 'next';
import Layout from '@/components/layout';
import client from '@/libs/server/client';
import { Kind } from '@prisma/client';
import { ProductWithCount } from 'pages';
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

interface MyPageContext extends NextPageContext {
  params: {
    id: string;
  };
}

export const getServerSideProps = async function (ctx: MyPageContext) {
  const userId = Number(ctx.query.id);
  const kind = 'Sale';

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
                  kind: { equals: 'Sale' }
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
