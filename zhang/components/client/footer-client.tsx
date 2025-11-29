'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'

const Comp = dynamic(() => import('@/components/wedding/footer'), { ssr: false })

export default function FooterClient(props: any) {
  return <Comp {...props} />
}
