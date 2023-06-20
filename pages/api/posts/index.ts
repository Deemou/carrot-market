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
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(400).json({ ok: false });

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
            id: Number(session.user.id)
          }
        }
      }
    });

    await res.revalidate('/community');

    res.json({
      ok: true,
      post
    });
  }
  if (req.method === 'GET') {
    const posts = await client.post.findMany({
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
      posts
    });
  }
}

export default withHandler({
  methods: ['GET', 'POST'],
  handler
});
