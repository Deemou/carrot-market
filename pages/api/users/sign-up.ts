/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import { hashPassword } from '@/libs/server/hash';
import withApiSession from '@libs/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { name, password } = req.body;
  const email = req.session.auth?.email;

  if (!name || !password || !email) return res.status(400).json({ ok: false });
  const hashedPassword = await hashPassword(password);

  const user = await client.user.create({
    data: {
      name,
      password: hashedPassword,
      email
    }
  });

  req.session.user = {
    id: user.id
  };
  await req.session.save();

  return res.json({
    ok: true
  });
}

export default withApiSession(
  withHandler({ methods: ['POST'], handler, isPrivate: false })
);
