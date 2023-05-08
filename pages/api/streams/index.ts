/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import withApiSession from '@libs/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === 'GET') {
    const limit = 5;
    const streamsCount = await client.stream.count();
    const page = Number(req.query.page);
    const lastPage = Math.ceil(streamsCount / limit);
    if (page < 1 || page > lastPage) {
      return res.status(404).end();
    }
    const skip = ((page || 1) - 1) * limit;
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
    const {
      session: { user },
      body: { name, price, description }
    } = req;

    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        user: {
          connect: {
            id: user?.id
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

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler
  })
);
