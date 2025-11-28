'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'

const Comp = dynamic(() => import('@/components/wedding/navbar'), { ssr: false })

export default function NavbarClient(props: any) {
  return <Comp {...props} />
}
