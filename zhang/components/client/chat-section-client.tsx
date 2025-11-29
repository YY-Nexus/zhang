'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'

const Comp = dynamic(() => import('@/components/wedding/chat-section'), { ssr: false })

export default function ChatSectionClient(props: any) {
  return <Comp {...props} />
}
