'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'

const Comp = dynamic(() => import('@/components/wedding/countdown-section'), { ssr: false })

export default function CountdownSectionClient(props: any) {
  return <Comp {...props} />
}
