/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import withApiSession from '@libs/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user }
  } = req;

  if (req.method === 'GET') {
    const product = await client.product.findUnique({
      where: {
        id: Number(id)
      }
    });
    if (!product)
      res.status(404).json({ ok: false, error: 'Not found product' });
    if (product?.userId !== user?.id)
      res.status(403).json({ ok: false, error: 'Unauthorized' });

    res.json({
      ok: true,
      product
    });
  }
  if (req.method === 'POST') {
    const {
      body: { name, price, description, image }
    } = req;

    await client.product.update({
      where: {
        id: Number(id)
      },
      data: {
        name,
        price: +price,
        description,
        image
      }
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    await res.revalidate(`/products/${id}`);

    res.json({
      ok: true
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler
  })
);
