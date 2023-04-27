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
    const post = await client.post.findUnique({
      where: {
        id: Number(id)
      }
    });
    if (!post) res.status(404).json({ ok: false, error: 'Not found post' });
    if (post?.userId !== user?.id)
      res.status(403).json({ ok: false, error: 'Unauthorized' });

    res.json({
      ok: true,
      post
    });
  }
  if (req.method === 'POST') {
    const {
      body: { question }
    } = req;

    await client.post.update({
      where: {
        id: Number(id)
      },
      data: {
        question
      }
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    await res.revalidate(`/community/${id}`);

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
