import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id }
  } = req;
  const post = await client.post.findUnique({
    where: {
      id: Number(id)
    }
  });
  if (!post) res.status(404).json({ ok: false, error: 'Not found post' });
  await client.post.delete({
    where: {
      id: Number(id)
    }
  });

  res.json({ ok: true });
}

export default withHandler({
  methods: ['POST'],
  handler
});
