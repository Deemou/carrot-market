/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import withApiSession from '@libs/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === 'GET') {
    const profile = await client.user.findUnique({
      where: { id: req.session.user?.id }
    });
    res.json({
      ok: true,
      profile
    });
  }
  if (req.method === 'POST') {
    const {
      session: { user },
      body: { email, name, avatar }
    } = req;
    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id
      }
    });

    if (email && email !== currentUser?.email) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: {
            email
          },
          select: {
            id: true
          }
        })
      );
      if (alreadyExists) {
        return res.json({
          ok: false,
          error: 'Email already taken.'
        });
      }
      await client.user.update({
        where: {
          id: user?.id
        },
        data: {
          email
        }
      });
      res.json({ ok: true });
    }

    if (name) {
      await client.user.update({
        where: {
          id: user?.id
        },
        data: {
          name
        }
      });
    }

    if (avatar) {
      await client.user.update({
        where: {
          id: user?.id
        },
        data: { avatar }
      });
    }

    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET', 'POST'],
    handler
  })
);
