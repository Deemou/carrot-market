/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

  const id = Number(req.query.id);

  if (req.method === 'GET') {
    const product = await client.product.findUnique({
      where: {
        id
      }
    });
    if (!product)
      res.status(404).json({ ok: false, error: 'Not found product' });
    if (product?.userId !== Number(session.user.id))
      res.status(403).json({ ok: false, error: 'Unauthorized' });

    res.json({
      ok: true,
      product
    });
  }

  if (req.method === 'POST') {
    const {
      body: { name, price, description, image, thumbImage }
    } = req;

    await client.product.update({
      where: {
        id
      },
      data: {
        name,
        price: +price,
        description,
        image,
        thumbImage
      }
    });

    await res.revalidate(`/products/${id}`);

    res.json({
      ok: true,
      id
    });
  }
}

export default withHandler({
  methods: ['GET', 'POST'],
  handler
});
