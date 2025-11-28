'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'

const Comp = dynamic(() => import('@/components/wedding/entertainment-zone'), { ssr: false })

export default function EntertainmentZoneClient(props: any) {
  return <Comp {...props} />
}
