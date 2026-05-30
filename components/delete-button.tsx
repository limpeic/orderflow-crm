'use client'

import { Button } from '@/components/ui/button'
import { useTransition } from 'react'

type Props = {
  action: () => Promise<void>
  confirm?: string
  label?: string
}

export function DeleteButton({
  action,
  confirm: confirmMsg = 'Are you sure?',
  label = 'Delete',
}: Props) {
  const [pending, startTransition] = useTransition()

  function handleClick() {
    if (!window.confirm(confirmMsg)) return
    startTransition(() => action())
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={pending}
      onClick={handleClick}
    >
      {pending ? 'Deleting…' : label}
    </Button>
  )
}
