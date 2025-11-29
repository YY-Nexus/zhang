'use client'

import dynamic from 'next/dynamic'
import * as React from 'react'

const WeddingMusicPlayer = dynamic(() => import('@/components/wedding/music-player-new'), {
  ssr: false,
})

export default function WeddingMusicPlayerClient() {
  return <WeddingMusicPlayer />
}
