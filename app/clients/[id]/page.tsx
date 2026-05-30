import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { buttonVariants } from '@/components/ui/button'
import { DeleteButton } from '@/components/delete-button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { ClientForm } from '../client-form'
import { updateClient, deleteClient } from '../actions'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/order-status'
import { updateOrderStatus } from '@/app/orders/actions'
import type { OrderStatus } from '@/app/generated/prisma/client'

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          status: true,
          totalValue: true,
          deliveryDate: true,
          createdAt: true,
        },
      },
    },
  })
  if (!client) notFound()

  const updateWithId = updateClient.bind(null, id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/clients" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold">Edit Client</h1>
      </div>

      <div className="rounded-lg border bg-background p-6">
        <ClientForm client={client} action={updateWithId} submitLabel="Save Changes" />

        <div className="mt-6 border-t pt-5">
          <DeleteButton
            action={deleteClient.bind(null, id)}
            confirm="Delete this client and all their orders?"
            label="Delete Client"
          />
        </div>
      </div>

      {client.orders.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Orders ({client.orders.length})</h2>
          <div className="rounded-lg border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value (IDR)</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {client.orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.title}</TableCell>
                    <TableCell>
                      <form action={updateOrderStatus} className="inline">
                        <input type="hidden" name="orderId" value={o.id} />
                        <input
                          type="hidden"
                          name="nextStatus"
                          value={
                            (Object.keys(STATUS_LABELS) as OrderStatus[])[
                              (Object.keys(STATUS_LABELS) as OrderStatus[]).indexOf(o.status) + 1 >=
                              Object.keys(STATUS_LABELS).length
                                ? 0
                                : (Object.keys(STATUS_LABELS) as OrderStatus[]).indexOf(o.status) + 1
                            ]
                          }
                        />
                        <input type="hidden" name="redirectTo" value={`/clients/${client.id}`} />
                        <button type="submit" className="rounded-full hover:opacity-90">
                          <Badge className={STATUS_COLORS[o.status]}>
                            {STATUS_LABELS[o.status]}
                          </Badge>
                        </button>
                      </form>
                    </TableCell>
                    <TableCell>
                      {o.totalValue != null
                        ? new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            maximumFractionDigits: 2,
                          }).format(o.totalValue)
                        : '—'}
                    </TableCell>
                    <TableCell>
                      {o.deliveryDate
                        ? new Date(o.deliveryDate).toLocaleDateString()
                        : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/orders/${o.id}`}
                        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                      >
                        Edit
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
