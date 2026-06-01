import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { buttonVariants } from '@/components/ui/button'
import { ClientSearch } from './client-search'

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orders: true } } },
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <Link href="/clients/new" className={buttonVariants()}>
          + Add Client
        </Link>
      </div>

      <ClientSearch clients={clients} />
    </div>
  )
}
