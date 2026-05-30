'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Client } from '@/app/generated/prisma/client'
import { useActionState } from 'react'

type Props = {
  client?: Client
  action: (formData: FormData) => Promise<void>
  submitLabel: string
}

export function ClientForm({ client, action, submitLabel }: Props) {
  const [, formAction, pending] = useActionState(
    async (_: unknown, formData: FormData) => {
      await action(formData)
      return null
    },
    null
  )

  return (
    <form action={formAction} className="space-y-5 max-w-lg">
      <div className="grid gap-1.5">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" name="name" defaultValue={client?.name} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="company">Company *</Label>
        <Input id="company" name="company" defaultValue={client?.company} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={client?.email ?? ''} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" defaultValue={client?.phone ?? ''} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={3} defaultValue={client?.notes ?? ''} />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}
