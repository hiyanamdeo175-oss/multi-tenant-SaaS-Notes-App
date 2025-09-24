import { NextApiRequest, NextApiResponse } from 'next';
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ status: 'ok' });
}
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ status: "ok", env: process.env.NODE_ENV });
}
