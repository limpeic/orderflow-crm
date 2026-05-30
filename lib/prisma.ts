import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaSqlite } from 'prisma-adapter-sqlite'
import path from 'path'

const dbPath = path.join(process.cwd(), 'dev.db')
const adapter = new PrismaSqlite({ url: `file:${dbPath}` })

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter } as never)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
