/* eslint-disable consistent-return */
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
    session: { user }
  } = req;

  if (!user) return res.status(400).json({ ok: false });

  if (req.method === 'GET') {
    const profile = await client.user.findUnique({
      where: { id: user.id }
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

    await client.user.update({
      where: {
        id: user.id
      },
      data: {
        name
      }
    });

    if (avatar) {
      await client.user.update({
        where: {
          id: user.id
        },
        data: { avatar }
      });
    }

    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler
  })
);
