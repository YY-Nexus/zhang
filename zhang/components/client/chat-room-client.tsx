'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'

const Comp = dynamic(() => import('@/components/wedding/chat-room'), { ssr: false })

export default function ChatRoomClient(props: any) {
  return <Comp {...props} />
}
