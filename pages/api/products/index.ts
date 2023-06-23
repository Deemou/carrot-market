/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === 'GET') {
    const page = Number(req.query.page);
    const limit = 10;
    const productCount = await client.product.count();
    const lastPage = Math.ceil(productCount / limit);
    if (page < 1 || page > lastPage) return res.json({ ok: false });

    const productQueries = await client.product.findMany({
      take: limit,
      skip: (page - 1) * limit,
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

    res.json({
      ok: true,
      products,
      lastPage
    });
  }

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    const {
      body: { name, price, description, image, thumbImage }
    } = req;
    if (!session) return res.status(400).json({ ok: false });
    const { user } = session;
    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        image,
        thumbImage,
        user: {
          connect: {
            id: Number(user.id)
          }
        }
      }
    });
    await client.record.create({
      data: {
        user: { connect: { id: Number(user.id) } },
        product: { connect: { id: Number(product.id) } },
        kind: 'Sale'
      }
    });

    await res.revalidate('/');

    res.json({
      ok: true,
      id: product.id
    });
  }
}

export default withHandler({
  methods: ['GET', 'POST'],
  handler
});
