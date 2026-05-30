'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { OrderStatus } from '@/app/generated/prisma/client'

const OrderSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  title: z.string().min(1, 'Title is required'),
  product: z.string().optional(), // JSON-encoded array of products
  totalValue: z.string().optional(),
  status: z.nativeEnum(OrderStatus),
  deliveryDate: z.string().optional(),
  notes: z.string().optional(),
})

export async function createOrder(formData: FormData) {
  const raw = {
    clientId: formData.get('clientId') as string,
    title: formData.get('title') as string,
    product: formData.get('product') as string,
    totalValue: formData.get('totalValue') as string,
    status: formData.get('status') as OrderStatus,
    deliveryDate: formData.get('deliveryDate') as string,
    notes: formData.get('notes') as string,
  }
  const data = OrderSchema.parse(raw)
  await prisma.order.create({
    data: {
      clientId: data.clientId,
      title: data.title,
      product: data.product || null,
      quantity: null,
      productNote: null,
      totalValue: data.totalValue ? parseFloat(data.totalValue) : null,
      status: data.status,
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
      notes: data.notes || null,
    },
  })
  revalidatePath('/orders')
  redirect('/orders')
}

export async function updateOrder(id: string, formData: FormData) {
  const raw = {
    clientId: formData.get('clientId') as string,
    title: formData.get('title') as string,
    product: formData.get('product') as string,
    totalValue: formData.get('totalValue') as string,
    status: formData.get('status') as OrderStatus,
    deliveryDate: formData.get('deliveryDate') as string,
    notes: formData.get('notes') as string,
  }
  const data = OrderSchema.parse(raw)
  await prisma.order.update({
    where: { id },
    data: {
      clientId: data.clientId,
      title: data.title,
      product: data.product || null,
      quantity: null,
      productNote: null,
      totalValue: data.totalValue ? parseFloat(data.totalValue) : null,
      status: data.status,
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
      notes: data.notes || null,
    },
  })
  revalidatePath('/orders')
  revalidatePath(`/orders/${id}`)
  redirect('/orders')
}

export async function updateOrderStatus(formData: FormData) {
  const orderId = formData.get('orderId') as string | null
  const nextStatus = formData.get('nextStatus') as OrderStatus | null
  const redirectTo = (formData.get('redirectTo') as string) || '/orders'

  if (!orderId || !nextStatus) {
    throw new Error('Order id and status are required')
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: nextStatus },
    select: { clientId: true },
  })

  revalidatePath('/orders')
  revalidatePath(`/clients/${updatedOrder.clientId}`)
  redirect(redirectTo)
}

export async function deleteOrder(id: string) {
  await prisma.order.delete({ where: { id } })
  revalidatePath('/orders')
  redirect('/orders')
}
