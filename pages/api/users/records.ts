/* eslint-disable no-underscore-dangle */
import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import withApiSession from '@libs/server/withSession';
import { Kind } from '@prisma/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    query: { kind, id }
  } = req;

  const userId = Number(id) || user?.id;

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
  res.json({
    ok: true,
    products
  });
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler
  })
);
