import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../src/lib/prisma';
import { requireAuth } from '../../../src/middleware/auth';

export default requireAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = (req as any).user;
  const tenantId = (user as any).tenantId;
  const id = Number(req.query.id);

  const note = await prisma.note.findUnique({ where: { id } });
  if (!note || note.tenantId !== tenantId) return res.status(404).json({ error: 'Not found' });

  if (req.method === 'GET') return res.json(note);
  if (req.method === 'PUT') {
    const { title, content } = req.body;
    const updated = await prisma.note.update({ where: { id }, data: { title, content } });
    return res.json(updated);
  }
  if (req.method === 'DELETE') {
    await prisma.note.delete({ where: { id } });
    return res.status(204).end();
  }

  return res.status(405).end();
});
