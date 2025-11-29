'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'

const Comp = dynamic(() => import('@/components/wedding/guest-sign-in'), { ssr: false })

export default function GuestSignInClient(props: any) {
  return <Comp {...props} />
}
