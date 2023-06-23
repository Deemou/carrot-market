/* eslint-disable @typescript-eslint/no-unsafe-call */
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
    query: { id }
  } = req;

  const alreadyExists = await client.record.findFirst({
    where: {
      productId: Number(id),
      userId: Number(session.user.id),
      kind: 'Fav'
    }
  });
  if (alreadyExists) {
    await client.record.delete({
      where: {
        id: alreadyExists.id
      }
    });
  } else {
    await client.record.create({
      data: {
        user: { connect: { id: Number(session.user.id) } },
        product: { connect: { id: Number(id) } },
        kind: 'Fav'
      }
    });
  }

  res.json({ ok: true });
}

export default withHandler({
  methods: ['POST'],
  handler
});
