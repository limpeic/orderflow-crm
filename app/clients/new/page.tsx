import { ClientForm } from '../client-form'
import { createClient } from '../actions'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function NewClientPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/clients" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold">Add Client</h1>
      </div>
      <div className="rounded-lg border bg-background p-6">
        <ClientForm action={createClient} submitLabel="Create Client" />
      </div>
    </div>
  )
}
