'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'

const Comp = dynamic(() => import('@/components/wedding/page-navigation'), { ssr: false })

export type { PageConfig } from '@/components/wedding/page-navigation'

export default function PageNavigationClient(props: any) {
  return <Comp {...props} />
}
