'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { syncTimezone } from '@/lib/actions/settings'

export function TimezoneSync({ storedTimezone }: { storedTimezone: string }) {
  const router = useRouter()

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (!timezone || timezone === storedTimezone) return
    syncTimezone(timezone).then(() => router.refresh())
  }, [router, storedTimezone])

  return null
}
