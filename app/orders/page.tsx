import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/order-status'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/app/generated/prisma/client'
import { updateOrderStatus } from './actions'

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; sort?: string }>
}) {
  const { status, sort } = await searchParams
  const validStatus = Object.keys(STATUS_LABELS).includes(status ?? '')
    ? (status as OrderStatus)
    : undefined

  const sortByDelivery = sort === 'delivery_desc' || sort === 'delivery_asc'
  const deliveryDir = sort === 'delivery_asc' ? 'asc' : 'desc'

  const orders = await prisma.order.findMany({
    where: validStatus ? { status: validStatus } : undefined,
    orderBy: sortByDelivery
      ? { deliveryDate: deliveryDir }
      : { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      status: true,
      totalValue: true,
      deliveryDate: true,
      client: { select: { name: true, company: true } },
    },
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <Link href="/orders/new" className={buttonVariants()}>
          + Add Order
        </Link>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/orders"
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            !validStatus
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          All
        </Link>
        {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
          <Link
            key={s}
            href={`/orders?status=${s}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              validStatus === s
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Value (IDR)</TableHead>
              <TableHead>
                <Link
                  href={`/orders?${new URLSearchParams({
                    ...(validStatus ? { status: validStatus } : {}),
                    sort: sort === 'delivery_desc' ? 'delivery_asc' : 'delivery_desc',
                  })}`}
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  Delivery
                  {sort === 'delivery_desc' && ' ↓'}
                  {sort === 'delivery_asc' && ' ↑'}
                  {!sortByDelivery && ' ↕'}
                </Link>
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No orders{validStatus ? ` with status "${STATUS_LABELS[validStatus]}"` : ''}.
                </TableCell>
              </TableRow>
            )}
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>
                  <div className="font-medium">{o.client.name}</div>
                  <div className="text-xs text-muted-foreground">{o.client.company}</div>
                </TableCell>
                <TableCell>{o.title}</TableCell>
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
                    <input type="hidden" name="redirectTo" value="/orders" />
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
                  {o.deliveryDate ? new Date(o.deliveryDate).toLocaleDateString('en-GB') : '—'}
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
  )
}
