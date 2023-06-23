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
  if (req.method === 'GET') {
    const page = Number(req.query.page);
    const limit = 5;
    const streamsCount = await client.stream.count();
    const lastPage = Math.ceil(streamsCount / limit);
    if (page < 1 || page > lastPage) {
      return res.status(404).end();
    }
    const skip = (page - 1) * limit;
    const streams = await client.stream.findMany({
      take: limit,
      skip,
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json({ ok: true, streams, lastPage });
  }
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(400).json({ ok: false });

    const {
      body: { name, price, description }
    } = req;

    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        user: {
          connect: {
            id: Number(session.user.id)
          }
        },
        chat: {
          create: {}
        }
      }
    });

    res.json({ ok: true, stream });
  }
}

export default withHandler({
  methods: ['GET', 'POST'],
  handler
});
