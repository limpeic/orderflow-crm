'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const ClientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company: z.string().min(1, 'Company is required'),
  email: z.string().email('Invalid email').or(z.literal('')).optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
})

export async function createClient(formData: FormData) {
  const raw = {
    name: formData.get('name') as string,
    company: formData.get('company') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    notes: formData.get('notes') as string,
  }
  const data = ClientSchema.parse(raw)
  await prisma.client.create({
    data: {
      name: data.name,
      company: data.company,
      email: data.email || null,
      phone: data.phone || null,
      notes: data.notes || null,
    },
  })
  revalidatePath('/clients')
  redirect('/clients')
}

export async function updateClient(id: string, formData: FormData) {
  const raw = {
    name: formData.get('name') as string,
    company: formData.get('company') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    notes: formData.get('notes') as string,
  }
  const data = ClientSchema.parse(raw)
  await prisma.client.update({
    where: { id },
    data: {
      name: data.name,
      company: data.company,
      email: data.email || null,
      phone: data.phone || null,
      notes: data.notes || null,
    },
  })
  revalidatePath('/clients')
  revalidatePath(`/clients/${id}`)
  redirect('/clients')
}

export async function deleteClient(id: string) {
  await prisma.client.delete({ where: { id } })
  revalidatePath('/clients')
  redirect('/clients')
}
