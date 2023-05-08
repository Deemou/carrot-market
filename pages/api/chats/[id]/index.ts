import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import withApiSession from '@libs/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id, page }
  } = req;
  const limit = 10;
  const chat = await client.chat.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      messages: {
        take: limit,
        skip: (Number(page) - 1) * limit,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          message: true,
          user: {
            select: {
              avatar: true,
              id: true
            }
          }
        }
      },
      _count: {
        select: { messages: true }
      }
    }
  });
  const lastPage = chat?._count.messages
    ? Math.ceil(chat._count.messages / limit)
    : 0;
  res.json({ ok: true, chat, lastPage });
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler
  })
);
