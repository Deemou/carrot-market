import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const session = await getServerSession(req, res, authOptions);

  const { token, email } = req.body;

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

  if (session) {
    await client.user.update({
      where: {
        id: Number(session.user.id)
      },
      data: {
        email
      }
    });
  }

  return res.json({ ok: true });
}

export default withHandler({ methods: ['POST'], handler });
