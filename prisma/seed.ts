import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaSqlite } from 'prisma-adapter-sqlite'
import path from 'path'

const dbPath = path.join(process.cwd(), 'dev.db')
const adapter = new PrismaSqlite({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter } as never)

async function main() {
  await prisma.order.deleteMany()
  await prisma.client.deleteMany()

  const acme = await prisma.client.create({
    data: {
      name: 'Sarah Chen',
      company: 'Acme Corp',
      email: 'sarah@acme.com',
      phone: '+60 12-345 6789',
      notes: 'Prefers premium packaging',
    },
  })

  const bloom = await prisma.client.create({
    data: {
      name: 'James Tan',
      company: 'Bloom Ventures',
      email: 'james@bloomvc.com',
      phone: '+60 11-234 5678',
    },
  })

  const nova = await prisma.client.create({
    data: {
      name: 'Priya Nair',
      company: 'Nova Health',
      email: 'priya@novahealth.my',
      notes: 'Annual gifting budget of RM 20k',
    },
  })

  await prisma.order.createMany({
    data: [
      {
        clientId: acme.id,
        title: 'Q1 Executive Hampers',
        product: JSON.stringify([{ product: 'Premium hamper set', quantity: 10, price: 350, productNote: 'Custom ribbon included' }]),
        quantity: null,
        productNote: null,
        totalValue: 3500,
        status: 'DELIVERED',
        deliveryDate: new Date('2026-03-15'),
      },
      {
        clientId: acme.id,
        title: 'Mid-Year Staff Gifts',
        product: JSON.stringify([{ product: 'Branded tote bags and notebooks', quantity: 50, price: 84, productNote: '' }]),
        quantity: null,
        productNote: null,
        totalValue: 4200,
        status: 'IN_PROGRESS',
        deliveryDate: new Date('2026-06-20'),
      },
      {
        clientId: bloom.id,
        title: 'Investor Appreciation Boxes',
        product: JSON.stringify([{ product: 'Luxury gift boxes', quantity: 8, price: 300, productNote: '' }]),
        quantity: null,
        productNote: null,
        totalValue: 2400,
        status: 'SHIPPED',
        deliveryDate: new Date('2026-05-30'),
      },
      {
        clientId: bloom.id,
        title: 'Team Onboarding Kits',
        product: JSON.stringify([{ product: 'Welcome kits with company swag', quantity: 15, price: 120, productNote: '' }]),
        quantity: null,
        productNote: null,
        totalValue: 1800,
        status: 'PENDING',
        deliveryDate: new Date('2026-06-10'),
      },
      {
        clientId: nova.id,
        title: 'Hari Raya Hampers',
        product: JSON.stringify([{ product: 'Festive hampers (halal certified)', quantity: 30, price: 170, productNote: '' }]),
        quantity: null,
        productNote: null,
        totalValue: 5100,
        status: 'DELIVERED',
        deliveryDate: new Date('2026-03-28'),
      },
    ],
  })

  console.log('Seeded 3 clients and 5 orders')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
