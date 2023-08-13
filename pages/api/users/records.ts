import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]';
import { Kind } from '@prisma/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(400).json({ ok: false });

  const {
    query: { kind, id }
  } = req;

  const userId = Number(id) || Number(session.user.id);
  const page = Number(req.query.page);
  const limit = 10;
  const recordAll = await client.record.findMany({
    where: {
      userId,
      kind: kind as Kind
    }
  });
  const recordCount = recordAll.length;
  const lastPage = Math.ceil(recordCount / limit);
  if (page < 1 || page > lastPage) return res.json({ ok: false });

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
  const records = recordQueries.map((record) => {
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
    records,
    lastPage
  });
}

export default withHandler({
  methods: ['GET'],
  handler
});
