import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../lib/jwt';

export function requireAuth(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = (req.headers.authorization || '') as string;
    const token = authHeader.replace('Bearer ', '');
    const user = token ? verifyToken(token) : null;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    (req as any).user = user;
    return handler(req, res);
  };
}

export function requireRole(role: string, handler: any) {
  return requireAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const user = (req as any).user;
    if (!user || (user as any).role !== role) return res.status(403).json({ error: 'Forbidden' });
    return handler(req, res);
  });
}
