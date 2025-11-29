'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'

const Comp = dynamic(() => import('@/components/wedding/about-section'), { ssr: false })

export default function AboutSectionClient(props: any) {
  return <Comp {...props} />
}
