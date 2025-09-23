import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../src/lib/prisma';
import { requireAuth } from '../../../../src/middleware/auth';

export default requireAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = (req as any).user;
  if ((user as any).role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  if (req.method !== 'POST') return res.status(405).end();
  const { slug } = req.query;
  const tenant = await prisma.tenant.findUnique({ where: { slug: String(slug) } });
  if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
  if ((user as any).tenantId !== tenant.id) return res.status(403).json({ error: 'Forbidden' });
  await prisma.tenant.update({ where: { id: tenant.id }, data: { plan: 'pro' } });
  return res.json({ success: true });
});
