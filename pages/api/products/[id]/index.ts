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
  if (!session) return res.status(400).json({ ok: false });

  const {
    query: { id }
  } = req;

  const product = await client.product.findUnique({
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
      }
    }
  });
  if (!product) res.status(404).json({ ok: false, error: 'Not found product' });
  const terms = product?.name.split(' ').map((word) => ({
    name: {
      contains: word
    }
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id
        }
      }
    }
  });
  const isLiked = Boolean(
    await client.record.findFirst({
      where: {
        productId: product?.id,
        userId: Number(session.user.id),
        kind: 'Fav'
      },
      select: {
        id: true
      }
    })
  );

  res.json({ ok: true, product, isLiked, relatedProducts });
}

export default withHandler({
  methods: ['GET'],
  handler
});
