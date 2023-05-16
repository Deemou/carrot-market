import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import withApiSession from '@libs/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === 'GET') {
    const {
      query: { q }
    } = req;
    const page = Number(req.query.page);
    const limit = 5;
    const streamAll = await client.stream.findMany({
      where: {
        name: {
          contains: q?.toString()
        }
      }
    });
    const streamCount = streamAll.length;
    if (streamCount === 0) {
      res.json({
        ok: false
      });
    }
    const lastPage = Math.ceil(streamCount / limit);
    if (page < 1 || page > lastPage) {
      return res.status(404).end();
    }
    const streams = await client.stream.findMany({
      where: {
        name: {
          contains: q?.toString()
        }
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json({
      ok: true,
      streams,
      lastPage
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler
  })
);
