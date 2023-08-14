import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import { isSamePassword } from '@/libs/server/hash';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false });

  const user = await client.user.findUnique({
    where: { email }
  });

  if (!user?.password)
    return res
      .status(400)
      .json({ ok: false, error: 'Invalid email or password.' });

  const match = await isSamePassword(password, user.password);

  if (!match)
    return res
      .status(400)
      .json({ ok: false, error: 'Invalid email or password.' });

  return res.json({ ok: true });
}

export default withHandler({ methods: ['POST'], handler });
