'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Client, Order, OrderStatus } from '@/app/generated/prisma/client'
import { STATUS_LABELS } from '@/lib/order-status'
import { useActionState } from 'react'

const statuses = Object.keys(STATUS_LABELS) as OrderStatus[]

type ProductEntry = {
  id: string
  product: string
  quantity: string
  price: string
  productNote: string
}

// Format price with dots as thousands separator (e.g., 50000 -> 50.000)
const formatPrice = (value: string | number): string => {
  const numStr = String(value).replace(/\./g, '')
  if (!numStr || isNaN(Number(numStr))) return ''
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// Parse price by removing dots (e.g., 50.000 -> 50000)
const parsePrice = (value: string): string => {
  return value.replace(/\./g, '')
}

type Props = {
  clients: Pick<Client, 'id' | 'name' | 'company'>[]
  order?: Order
  action: (formData: FormData) => Promise<void>
  submitLabel: string
}

export function OrderForm({ clients, order, action, submitLabel }: Props) {
  // Parse existing products from order, or initialize with empty array
  const initialProducts: ProductEntry[] = order?.product
    ? (() => {
        try {
          const parsed = JSON.parse(order.product)
          return Array.isArray(parsed)
            ? parsed.map((p, i) => ({
                id: `${Date.now()}-${i}`,
                product: p.product || '',
                quantity: p.quantity ? String(p.quantity) : '',
                price: p.price ? String(p.price) : '',
                productNote: p.productNote || '',
              }))
            : [
                {
                  id: `${Date.now()}-0`,
                  product: order.product || '',
                  quantity: order.quantity ? String(order.quantity) : '',
                  price: '',
                  productNote: order.productNote || '',
                },
              ]
        } catch {
          return [
            {
              id: `${Date.now()}-0`,
              product: order.product || '',
              quantity: order.quantity ? String(order.quantity) : '',
              price: '',
              productNote: order.productNote || '',
            },
          ]
        }
      })()
    : [{ id: `${Date.now()}-0`, product: '', quantity: '', price: '', productNote: '' }]

  const [products, setProducts] = useState<ProductEntry[]>(initialProducts)

  const [, formAction, pending] = useActionState(
    async (_: unknown, formData: FormData) => {
      // Serialize products to JSON before submission
      const productsData = products.map((p) => ({
        product: p.product,
        quantity: p.quantity ? parseInt(p.quantity, 10) : null,
        price: p.price ? parseFloat(p.price) : null,
        productNote: p.productNote,
      }))
      formData.set('product', JSON.stringify(productsData))
      // Calculate total price from products
      const totalPrice = products.reduce((sum, p) => {
        const qty = p.quantity ? parseInt(p.quantity, 10) : 0
        const price = p.price ? parseFloat(p.price) : 0
        return sum + qty * price
      }, 0)
      formData.set('totalValue', String(totalPrice))
      await action(formData)
      return null
    },
    null
  )

  const deliveryDateValue = order?.deliveryDate
    ? new Date(order.deliveryDate).toISOString().split('T')[0]
    : ''

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: `${Date.now()}-${products.length}`,
        product: '',
        quantity: '',
        price: '',
        productNote: '',
      },
    ])
  }

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const updateProduct = (id: string, field: keyof ProductEntry, value: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    )
  }

  return (
    <form action={formAction} className="space-y-5 max-w-4xl">
      <div className="grid gap-1.5">
        <Label htmlFor="clientId">Client *</Label>
        <Select name="clientId" defaultValue={order?.clientId} required>
          <SelectTrigger id="clientId">
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} — {c.company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={order?.status ?? 'PENDING'}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" defaultValue={order?.title} required />
      </div>

      {/* Products section */}
      <div className="space-y-3 border rounded-lg p-4 bg-muted/50">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Products</Label>
          <Button type="button" variant="outline" size="sm" onClick={addProduct}>
            + Add Product
          </Button>
        </div>

        <div className="space-y-2">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_100px_120px_150px_40px] gap-2 text-xs font-medium text-muted-foreground px-2">
            <div>Product</div>
            <div>Quantity</div>
            <div>Price (IDR)</div>
            <div>Additional Note</div>
            <div></div>
          </div>

          {/* Product entries */}
          {products.map((p) => (
            <div key={p.id} className="grid grid-cols-[1fr_100px_120px_150px_40px] gap-2">
              <Input
                placeholder="Product name"
                value={p.product ?? ''}
                onChange={(e) => updateProduct(p.id, 'product', e.target.value)}
                className="h-8"
              />
              <Input
                placeholder="Qty"
                type="number"
                min="0"
                step="1"
                value={p.quantity ?? ''}
                onChange={(e) => updateProduct(p.id, 'quantity', e.target.value)}
                className="h-8"
              />
              <Input
                placeholder="0"
                type="text"
                value={formatPrice(p.price ?? '')}
                onChange={(e) => updateProduct(p.id, 'price', parsePrice(e.target.value))}
                className="h-8"
              />
              <Input
                placeholder="Note"
                value={p.productNote ?? ''}
                onChange={(e) => updateProduct(p.id, 'productNote', e.target.value)}
                className="h-8"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeProduct(p.id)}
                disabled={products.length === 1}
                className="h-8 px-2 text-destructive hover:text-destructive"
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label>Total Price (IDR)</Label>
          <div className="px-3 py-2 rounded-md border border-input bg-background text-sm">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0,
            }).format(
              products.reduce((sum, p) => {
                const qty = p.quantity ? parseInt(p.quantity, 10) : 0
                const price = p.price ? parseFloat(p.price) : 0
                return sum + qty * price
              }, 0)
            )}
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="deliveryDate">Delivery Date</Label>
          <Input
            id="deliveryDate"
            name="deliveryDate"
            type="date"
            defaultValue={deliveryDateValue}
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={2} defaultValue={order?.notes ?? ''} />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}
