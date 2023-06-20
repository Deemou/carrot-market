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
  const alreadyExists = await client.wondering.findFirst({
    where: {
      userId: Number(session.user.id),
      postId: Number(id)
    },
    select: {
      id: true
    }
  });

  if (alreadyExists) {
    await client.wondering.delete({
      where: {
        id: alreadyExists.id
      }
    });
  } else {
    await client.wondering.create({
      data: {
        user: {
          connect: {
            id: Number(session.user.id)
          }
        },
        post: {
          connect: {
            id: Number(id)
          }
        }
      }
    });
  }

  await res.revalidate(`/community/${id}`);
  res.json({
    ok: true
  });
}

export default withHandler({
  methods: ['POST'],
  handler
});
