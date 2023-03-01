/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import smtpTransport from '@/libs/server/email';
import withApiSession from '@libs/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ ok: false });
  const alreadyExists = Boolean(
    await client.user.findUnique({
      where: {
        email
      }
    })
  );
  if (alreadyExists) {
    return res.json({
      ok: false,
      error: 'Email already taken.'
    });
  }
  const payload = `${Math.floor(100000 + Math.random() * 900000)}`;
  const token = await client.token.create({
    data: {
      payload,
      email
    }
  });
  console.log('token:', token);

  const mailOptions = {
    from: process.env.MAIL_ID,
    to: email,
    subject: 'Tweeter email verification',
    text: `Verification Code : ${payload}`
  };
  const result = await smtpTransport.sendMail(
    mailOptions,
    (error, responses) => {
      if (error) {
        console.log(error);
        return null;
      }
      console.log(responses);
      return null;
    }
  );
  smtpTransport.close();
  console.log(result);

  req.session.auth = {
    email
  };
  await req.session.save();

  return res.json({
    ok: true
  });
}

export default withApiSession(
  withHandler({ methods: ['POST'], handler, isPrivate: false })
);
