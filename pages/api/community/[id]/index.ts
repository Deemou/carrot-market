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
    query: { id }
  } = req;

  const post = await client.post.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      },
      answers: {
        select: {
          answer: true,
          id: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      },
      _count: {
        select: {
          answers: true,
          wonderings: true
        }
      }
    }
  });
  if (!post) res.status(404).json({ ok: false, error: 'Not found post' });
  const alreadyExists = await client.wondering.findFirst({
    where: {
      userId: Number(session.user.id),
      postId: Number(id)
    },
    select: {
      id: true
    }
  });
  const isWondering = Boolean(alreadyExists);

  res.json({
    ok: true,
    post,
    isWondering
  });
}

export default withHandler({
  methods: ['GET'],
  handler
});
