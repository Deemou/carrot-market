/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  const {
    query: { id },
    body
  } = req;

  const message = await client.message.create({
    data: {
      message: body.message,
      chat: {
        connect: {
          id: Number(id)
        }
      },
      user: {
        connect: {
          id: Number(session.user.id)
        }
      }
    }
  });

  res.json({ ok: true, message });
}

export default withHandler({
  methods: ['POST'],
  handler
});
