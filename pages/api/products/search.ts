import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === 'GET') {
    const {
      query: { q }
    } = req;
    const page = Number(req.query.page);
    const limit = 10;
    const productAll = await client.product.findMany({
      where: {
        name: {
          contains: q?.toString()
        }
      }
    });
    const productCount = productAll.length;
    if (productCount === 0) {
      res.json({
        ok: false
      });
    }
    const lastPage = Math.ceil(productCount / limit);
    if (page < 1 || page > lastPage) {
      return res.status(404).end();
    }
    const productQueries = await client.product.findMany({
      where: {
        name: {
          contains: q?.toString()
        }
      },
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
}

export default withHandler({
  methods: ['GET'],
  handler
});
