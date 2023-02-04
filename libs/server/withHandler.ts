/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable consistent-return */
import { NextApiHandler } from 'next';

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

type method = 'GET' | 'POST' | 'DELETE';

interface ConfigType {
  methods: method[];
  handler: NextApiHandler;
  isPrivate?: boolean;
}

export default function withHandler({
  methods,
  handler,
  isPrivate = true
}: ConfigType): NextApiHandler {
  return async (req, res) => {
    if (req.method && !methods.includes(req.method as any)) {
      return res.status(405).end();
    }
    if (isPrivate && !req.session.user) {
      return res.status(401).json({ ok: false, error: 'Plz log in.' });
    }
    try {
      await handler(req, res);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
}
