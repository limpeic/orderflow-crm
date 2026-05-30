'use client'

import { useEffect } from 'react'

export default function CloseDetailsOnOutside() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      try {
        const openDetails = Array.from(document.querySelectorAll('details[open]')) as HTMLDetailsElement[]
        for (const d of openDetails) {
          if (!d.contains(e.target as Node)) {
            d.removeAttribute('open')
          }
        }
      } catch (err) {
        // ignore
      }
    }

    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  return null
}
