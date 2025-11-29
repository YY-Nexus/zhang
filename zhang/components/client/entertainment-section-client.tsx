'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'

const Comp = dynamic(() => import('@/components/wedding/entertainment-section'), { ssr: false })

export default function EntertainmentSectionClient(props: any) {
  return <Comp {...props} />
}
