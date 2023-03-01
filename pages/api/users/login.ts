/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import { isSamePassword } from '@/libs/server/hash';
import withApiSession from '@libs/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false });
  const user = await client.user.findUnique({
    where: { email }
  });
  if (!user)
    return res
      .status(400)
      .json({ ok: false, error: 'Invalid email or password.' });

  const match = await isSamePassword(password, user.password);

  if (!match)
    return res
      .status(400)
      .json({ ok: false, error: 'Invalid email or password.' });

  req.session.user = {
    id: user.id
  };
  await req.session.save();

  return res.json({ ok: true });
}

export default withApiSession(
  withHandler({ methods: ['POST'], handler, isPrivate: false })
);
