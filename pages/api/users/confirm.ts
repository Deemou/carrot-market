/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import withApiSession from '@libs/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token } = req.body;
  const email = req.session.auth?.email;
  const foundToken = await client.token.findUnique({
    where: {
      payload: token
    }
  });

  if (!foundToken || foundToken.email !== email)
    return res.json({
      ok: false,
      error: 'Invalid Token. Please check again.'
    });

  await client.token.deleteMany({
    where: {
      email: foundToken.email
    }
  });

  return res.json({ ok: true });
}

export default withApiSession(
  withHandler({ methods: ['POST'], handler, isPrivate: false })
);
