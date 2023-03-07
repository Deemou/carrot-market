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
    query: { id },
    session: { user },
    body: { answer }
  } = req;

  const newAnswer = await client.answer.create({
    data: {
      user: {
        connect: {
          id: user?.id
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
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  await res.revalidate(`/community/${id}`);
  res.json({
    ok: true,
    answer: newAnswer
  });
}

export default withApiSession(
  withHandler({
    methods: ['POST'],
    handler
  })
);
