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

  const reviews = await client.review.findMany({
    where: {
      createdForId: Number(session.user.id)
    },
    include: { createdBy: { select: { id: true, name: true, avatar: true } } }
  });

  res.json({
    ok: true,
    reviews
  });
}

export default withHandler({
  methods: ['GET'],
  handler
});
