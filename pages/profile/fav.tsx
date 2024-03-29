import type { NextPage, NextPageContext } from 'next';
import client from '@/libs/server/client';
import { Kind } from '@prisma/client';
import { getSession } from 'next-auth/react';
import Layout from '@/components/common/layout';
import RecordList from '@/components/product/record-list';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import PaginationBar from '@/components/pagination/pagination-bar';
import { RecordListResponse } from '@/types/product';

const kind = 'Fav';

const Fav: NextPage<RecordListResponse> = (props) => {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const { data } = useSWR<RecordListResponse>(
    `/api/users/records?kind=${kind}&page=${page}`,
    {
      fallbackData: props
    }
  );

  useEffect(() => {
    if (router?.query?.page) setPage(+router.query.page);
    else setPage(1);
  }, [page, router]);

  return (
    <Layout seoTitle="Record Fav">
      {data?.ok && (
        <>
          <RecordList records={data.records} />
          <PaginationBar currentPage={page} lastPage={data.lastPage} />
        </>
      )}
    </Layout>
  );
};

export const getServerSideProps = async function (ctx: NextPageContext) {
  const session = await getSession(ctx);
  const userId = Number(session?.user?.id);
  const page = Number(ctx.query.page) || 1;
  const limit = 10;

  const recordQueries = await client.record.findMany({
    take: limit,
    skip: (page - 1) * limit,
    orderBy: {
      createdAt: 'desc'
    },
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

export default Fav;
