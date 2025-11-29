'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'

const Comp = dynamic(() => import('@/components/wedding/interaction-section'), { ssr: false })

export default function InteractionSectionClient(props: any) {
  return <Comp {...props} />
}
