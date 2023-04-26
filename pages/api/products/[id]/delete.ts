import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import withApiSession from '@libs/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id }
  } = req;
  const product = await client.product.findUnique({
    where: {
      id: Number(id)
    }
  });
  if (!product) res.status(404).json({ ok: false, error: 'Not found product' });
  await client.product.delete({
    where: {
      id: Number(id)
    }
  });

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  await res.revalidate('/');

  res.json({ ok: true });
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler
  })
);
