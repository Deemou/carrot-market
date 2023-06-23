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

  const user = await client.user.findUnique({
    where: {
      id: Number(id)
    }
  });

  res.json({ ok: true, user });
}

export default withHandler({
  methods: ['GET'],
  handler
});
