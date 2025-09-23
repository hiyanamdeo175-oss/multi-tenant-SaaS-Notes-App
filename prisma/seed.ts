import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const acme = await prisma.tenant.upsert({ where: { slug: 'acme' }, update: {}, create: { name: 'Acme', slug: 'acme' } });
  const globex = await prisma.tenant.upsert({ where: { slug: 'globex' }, update: {}, create: { name: 'Globex', slug: 'globex' } });

  const pw = bcrypt.hashSync(process.env.SEED_PASSWORD || 'password', 8);

  await prisma.user.upsert({ where: { email: 'admin@acme.test' }, update: {}, create: { email: 'admin@acme.test', password: pw, role: 'admin', tenantId: acme.id } });
  await prisma.user.upsert({ where: { email: 'user@acme.test' }, update: {}, create: { email: 'user@acme.test', password: pw, role: 'member', tenantId: acme.id } });
  await prisma.user.upsert({ where: { email: 'admin@globex.test' }, update: {}, create: { email: 'admin@globex.test', password: pw, role: 'admin', tenantId: globex.id } });
  await prisma.user.upsert({ where: { email: 'user@globex.test' }, update: {}, create: { email: 'user@globex.test', password: pw, role: 'member', tenantId: globex.id } });

  console.log('Seed complete');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
