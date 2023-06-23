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
  const stream = await client.stream.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      chat: {
        select: {
          id: true
        }
      }
    }
  });
  res.json({ ok: true, stream });
}

export default withHandler({
  methods: ['GET'],
  handler
});
