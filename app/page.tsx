import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/order-status'
import { updateOrderStatus } from './orders/actions'
import type { OrderStatus } from '@/app/generated/prisma/client'
import CloseDetailsOnOutside from '@/components/CloseDetailsOnOutside'
import { cn } from '@/lib/utils'

function getUrgency(deliveryDate: Date): 'red' | 'yellow' | 'green' {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const delivery = new Date(deliveryDate)
  delivery.setHours(0, 0, 0, 0)
  const days = Math.floor((delivery.getTime() - today.getTime()) / 86_400_000)
  if (days <= 0) return 'red'
  if (days <= 3) return 'yellow'
  return 'green'
}

const URGENCY_DOT = { red: 'bg-red-500', yellow: 'bg-yellow-400', green: 'bg-green-500' } as const
const URGENCY_TEXT = { red: 'text-red-600', yellow: 'text-yellow-600', green: 'text-green-600' } as const
const URGENCY_LABEL = { red: 'Today / Overdue', yellow: 'Within 3 days', green: 'On track' } as const

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const raw = await searchParams
  const q = (Array.isArray(raw.q) ? raw.q[0] : raw.q) ?? ''
  const sort = (Array.isArray(raw.sort) ? raw.sort[0] : raw.sort) ?? ''
  const order = ((Array.isArray(raw.order) ? raw.order[0] : raw.order) ?? '') === 'asc' ? 'asc' : 'desc'

  const where = q
    ? {
        client: { name: { contains: q, mode: 'insensitive' } },
      }
    : undefined

  const orderBy: any = sort === 'status'
    ? { status: order }
    : sort === 'delivery'
    ? { deliveryDate: order }
    : { createdAt: 'desc' }

  const [totalClients, totalOrders, activeOrders, deliveredOrders, recentOrders, upcomingOrders] =
    await Promise.all([
      prisma.client.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: { in: ['PENDING', 'IN_PROGRESS'] } } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.findMany({
        take: 10,
        where,
        orderBy,
        select: {
          id: true,
          title: true,
          status: true,
          deliveryDate: true,
          createdAt: true,
          client: { select: { name: true } },
        },
      }),
      prisma.order.findMany({
        where: {
          deliveryDate: { not: null },
          status: { notIn: ['DELIVERED', 'CANCELLED'] },
        },
        orderBy: { deliveryDate: 'asc' },
        take: 20,
        select: {
          id: true,
          title: true,
          deliveryDate: true,
          client: { select: { name: true } },
        },
      }),
    ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalClients}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{activeOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Delivered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{deliveredOrders}</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deliveries */}
      <div className="space-y-3">
        <h2 className="text-lg font-medium">Upcoming Deliveries</h2>
        {upcomingOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming deliveries.</p>
        ) : (
          <div className="rounded-lg border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-6"></TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingOrders.map((o) => {
                  const urgency = getUrgency(o.deliveryDate!)
                  return (
                    <TableRow key={o.id}>
                      <TableCell>
                        <span className={cn('inline-block h-3 w-3 rounded-full', URGENCY_DOT[urgency])} />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link href={`/orders/${o.id}`}>{o.client.name}</Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/orders/${o.id}`}>{o.title}</Link>
                      </TableCell>
                      <TableCell>
                        {new Date(o.deliveryDate!).toLocaleDateString()}
                      </TableCell>
                      <TableCell className={cn('text-xs font-medium', URGENCY_TEXT[urgency])}>
                        {URGENCY_LABEL[urgency]}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Recent orders */}
      <div className="space-y-3">
        <CloseDetailsOnOutside />
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent Orders</h2>
          <div className="flex items-center gap-3">
            <form method="get" className="flex items-center">
              <input
                name="q"
                defaultValue={q}
                placeholder="Search by client name"
                className="rounded-md border px-3 py-1 text-sm"
              />
            </form>
            <Link href="/orders" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              View all
            </Link>
          </div>
        </div>
        <div className="rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>
                  <a
                    href={
                      '?' +
                      new URLSearchParams({
                        ...(q ? { q } : {}),
                        sort: 'status',
                        order: sort === 'status' && order === 'asc' ? 'desc' : 'asc',
                      }).toString()
                    }
                    className="cursor-pointer"
                  >
                    Status
                  </a>
                </TableHead>
                <TableHead>
                  <a
                    href={
                      '?' +
                      new URLSearchParams({
                        ...(q ? { q } : {}),
                        sort: 'delivery',
                        order: sort === 'delivery' && order === 'asc' ? 'desc' : 'asc',
                      }).toString()
                    }
                    className="cursor-pointer"
                  >
                    Delivery
                  </a>
                </TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No orders yet.{' '}
                    <Link href="/orders/new" className="underline">
                      Add one.
                    </Link>
                  </TableCell>
                </TableRow>
              )}
              {recentOrders.map((o) => (
                <TableRow
                  key={o.id}
                  className={cn(
                    o.status === 'DELIVERED' ? 'bg-muted/50' : 'hover:bg-gray-100 transition-colors'
                  )}
                >
                  <TableCell className="font-medium">
                    <Link href={`/orders/${o.id}`} className="block w-full h-full">
                      {o.client.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/orders/${o.id}`} className="block w-full h-full">
                      {o.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <details className="relative inline-block">
                      <summary className="list-none">
                        <Badge className={STATUS_COLORS[o.status]}>
                          {STATUS_LABELS[o.status]}
                        </Badge>
                      </summary>
                      <div className="absolute z-10 mt-2 w-48 rounded-md border bg-popover p-2 shadow">
                        {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                          <form key={s} action={updateOrderStatus} className="mb-1">
                            <input type="hidden" name="orderId" value={o.id} />
                            <input type="hidden" name="nextStatus" value={s} />
                            <input type="hidden" name="redirectTo" value="/" />
                            <button
                              type="submit"
                              className={`w-full text-left rounded px-2 py-1 text-sm ${
                                s === o.status ? 'font-semibold' : 'hover:bg-accent'
                              }`}
                            >
                              {STATUS_LABELS[s]}
                            </button>
                          </form>
                        ))}
                      </div>
                    </details>
                  </TableCell>
                  <TableCell>
                    <Link href={`/orders/${o.id}`} className="block w-full h-full">
                      {o.deliveryDate ? new Date(o.deliveryDate).toLocaleDateString() : '—'}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/orders/${o.id}`} className="block w-full h-full">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
