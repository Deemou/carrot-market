import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.json({ ok: false });
  }

  const { user } = session;
  if (!user) return res.status(400).json({ ok: false });
  const id = Number(user.id);

  if (req.method === 'GET') {
    const profile = await client.user.findUnique({
      where: { id }
    });

    res.json({
      ok: true,
      profile
    });
  }

  if (req.method === 'POST') {
    const {
      body: { name, avatar }
    } = req;

    if (!name) return res.status(400).json({ ok: false });

    await client.user.update({
      where: {
        id
      },
      data: {
        name
      }
    });

    if (avatar) {
      await client.user.update({
        where: {
          id
        },
        data: { avatar }
      });
    }

    res.json({ ok: true });
  }
}

export default withHandler({
  methods: ['GET', 'POST'],
  handler
});
