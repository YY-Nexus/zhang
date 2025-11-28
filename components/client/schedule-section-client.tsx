'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'

const Comp = dynamic(() => import('@/components/wedding/schedule-section'), { ssr: false })

export default function ScheduleSectionClient(props: any) {
  return <Comp {...props} />
}
