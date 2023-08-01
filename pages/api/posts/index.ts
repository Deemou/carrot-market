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
    const limit = 10;
    const postCount = await client.post.count();
    const lastPage = Math.ceil(postCount / limit);
    if (page < 1 || page > lastPage) return res.json({ ok: false });

    const posts = await client.post.findMany({
      take: limit,
      skip: (page - 1) * limit,
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
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(400).json({ ok: false });
    const { user } = session;

    const {
      body: { question, latitude, longitude }
    } = req;

    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: Number(user.id)
          }
        }
      }
    });

    res.json({
      ok: true,
      post
    });
  }
}

export default withHandler({
  methods: ['GET', 'POST'],
  handler
});
