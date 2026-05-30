import type { OrderStatus } from '@/app/generated/prisma/client'

export const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

export const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-100',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
  SHIPPED: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100',
  DELIVERED: 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100',
  CANCELLED: 'bg-red-100 text-red-600 border-red-200 hover:bg-red-100',
}
