import { prisma } from '@/lib/prisma'
import { OrderForm } from '../order-form'
import { createOrder } from '../actions'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default async function NewOrderPage() {
  const clients = await prisma.client.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, company: true },
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/orders" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold">Add Order</h1>
      </div>
      <div className="rounded-lg border bg-background p-6">
        <OrderForm clients={clients} action={createOrder} submitLabel="Create Order" />
      </div>
    </div>
  )
}
