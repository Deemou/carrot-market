/* eslint-disable consistent-return */
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
    if (page < 1 || page > Math.ceil(streamsCount / limit)) {
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
    res.json({ ok: true, streams, streamsCount, limit });
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
