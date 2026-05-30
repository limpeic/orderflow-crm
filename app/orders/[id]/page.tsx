import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { buttonVariants } from '@/components/ui/button'
import { DeleteButton } from '@/components/delete-button'
import { OrderForm } from '../order-form'
import { updateOrder, deleteOrder } from '../actions'

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [order, clients] = await Promise.all([
    prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        clientId: true,
        title: true,
        product: true,
        quantity: true,
        productNote: true,
        totalValue: true,
        status: true,
        deliveryDate: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.client.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, company: true },
    }),
  ])
  if (!order) notFound()

  const updateWithId = updateOrder.bind(null, id)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/orders" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold">Edit Order</h1>
      </div>

      <div className="rounded-lg border bg-background p-6">
        <OrderForm
          clients={clients}
          order={order}
          action={updateWithId}
          submitLabel="Save Changes"
        />

        <div className="mt-6 border-t pt-5">
          <DeleteButton
            action={deleteOrder.bind(null, id)}
            confirm="Delete this order?"
            label="Delete Order"
          />
        </div>
      </div>
    </div>
  )
}
