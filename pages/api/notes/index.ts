import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../src/lib/prisma';
import { requireAuth } from '../../../src/middleware/auth';

export default requireAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = (req as any).user;
  const tenantId = (user as any).tenantId;

  if (req.method === 'GET') {
    const notes = await prisma.note.findMany({ where: { tenantId } });
    return res.json(notes);
  }

  if (req.method === 'POST') {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (tenant?.plan === 'free') {
      const count = await prisma.note.count({ where: { tenantId } });
      if (count >= 3) return res.status(403).json({ error: 'Free plan limit reached' });
    }
    const { title, content } = req.body;
    const note = await prisma.note.create({ data: { title, content, tenantId } });
    return res.status(201).json(note);
  }

  return res.status(405).end();
});
