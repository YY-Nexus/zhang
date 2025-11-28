'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'

const Comp = dynamic(() => import('@/components/wedding/video-showcase'), { ssr: false })

export default function VideoShowcaseClient(props: any) {
  return <Comp {...props} />
}
