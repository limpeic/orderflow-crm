'use client'

import { useState } from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

type Client = {
  id: string
  name: string
  company: string
  email: string | null
  phone: string | null
  _count: { orders: number }
}

export function ClientSearch({ clients }: { clients: Client[] }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? clients.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      )
    : clients

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name…"
        className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-center">Orders</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {query ? `No clients match "${query}".` : (
                    <>No clients yet. <Link href="/clients/new" className="underline">Add one.</Link></>
                  )}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.company}</TableCell>
                <TableCell>{c.email ?? '—'}</TableCell>
                <TableCell>{c.phone ?? '—'}</TableCell>
                <TableCell className="text-center">{c._count.orders}</TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/clients/${c.id}`}
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
