/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import { hashPassword } from '@/libs/server/hash';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === 'POST') {
    const { name, password, email } = req.body;

    if (!name || !password || !email)
      return res.status(400).json({ ok: false });

    const hashedPassword = await hashPassword(password);

    await client.user.create({
      data: { name, email, password: hashedPassword }
    });

    return res.json({
      ok: true
    });
  }
}

export default withHandler({ methods: ['POST'], handler });
