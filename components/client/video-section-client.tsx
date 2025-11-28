'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'

const Comp = dynamic(() => import('@/components/wedding/video-section'), { ssr: false })

export default function VideoSectionClient(props: any) {
  return <Comp {...props} />
}
