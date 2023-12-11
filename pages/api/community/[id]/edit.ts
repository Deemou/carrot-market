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

  const {
    query: { id }
  } = req;

  if (req.method === 'GET') {
    const post = await client.post.findUnique({
      where: {
        id: Number(id)
      }
    });
    if (!post) res.status(404).json({ ok: false, error: 'Not found post' });
    if (post?.userId !== Number(session.user.id))
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

    await res.revalidate(`/community/${id}`);

    res.json({
      ok: true
    });
  }
}

export default withHandler({
  methods: ['GET', 'POST'],
  handler
});
