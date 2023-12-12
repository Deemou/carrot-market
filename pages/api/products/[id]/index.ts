import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const session = await getServerSession(req, res, authOptions);

  const {
    query: { id }
  } = req;

  const productQuery = await client.product.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      },
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
  if (!productQuery)
    return res.status(404).json({ ok: false, error: 'Not found product' });

  const terms = productQuery.name.split(' ').map((word) => ({
    name: {
      contains: word
    }
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: productQuery?.id
        }
      }
    }
  });
  const isLiked = session
    ? Boolean(
        await client.record.findFirst({
          where: {
            productId: productQuery?.id,
            userId: Number(session.user.id),
            kind: 'Fav'
          },
          select: {
            id: true
          }
        })
      )
    : false;
  const product = {
    ...productQuery,
    _count: { favs: productQuery._count.records }
  };

  res.json({ ok: true, product, isLiked, relatedProducts });
}

export default withHandler({
  methods: ['GET'],
  handler
});
