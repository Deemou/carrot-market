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
    body: { answer }
  } = req;

  const newAnswer = await client.answer.create({
    data: {
      user: {
        connect: {
          id: Number(session.user.id)
        }
      },
      post: {
        connect: {
          id: Number(id)
        }
      },
      answer
    }
  });

  console.log(newAnswer);

  await res.revalidate(`/community/${id}`);
  res.json({
    ok: true,
    answer: newAnswer
  });
}

export default withHandler({
  methods: ['POST'],
  handler
});
