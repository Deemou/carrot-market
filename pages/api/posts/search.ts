import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === 'GET') {
    const {
      query: { q }
    } = req;
    const page = Number(req.query.page);
    const limit = 10;
    const postAll = await client.post.findMany({
      where: {
        question: {
          contains: q?.toString()
        }
      }
    });
    const postCount = postAll.length;
    if (postCount === 0) {
      res.json({
        ok: false
      });
    }
    const lastPage = Math.ceil(postCount / limit);
    if (page < 1 || page > lastPage) {
      return res.status(404).end();
    }
    const posts = await client.post.findMany({
      where: {
        question: {
          contains: q?.toString()
        }
      },
      take: limit,
      skip: (Number(page) - 1) * limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            wonderings: true,
            answers: true
          }
        }
      }
    });
    res.json({
      ok: true,
      posts,
      lastPage
    });
  }
}

export default withHandler({
  methods: ['GET'],
  handler
});
