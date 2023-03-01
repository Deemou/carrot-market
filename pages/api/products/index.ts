/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import withApiSession from '@libs/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === 'GET') {
    const {
      query: { page }
    } = req;
    const limit = 10;
    const productCount = await client.product.count();
    const productQueries = await client.product.findMany({
      take: limit,
      skip: (Number(page) - 1) * limit,
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
    const lastPage = Math.ceil(productCount / limit);
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
    const {
      body: { name, price, description },
      session: { user }
    } = req;
    const product = await client.product.create({
      data: {
        name,
        price: +price,
        description,
        image: 'xx',
        user: {
          connect: {
            id: user?.id
          }
        }
      }
    });
    await client.record.create({
      data: {
        user: { connect: { id: user?.id } },
        product: { connect: { id: Number(product.id) } },
        kind: 'Sale'
      }
    });
    res.json({
      ok: true,
      product
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler
  })
);
