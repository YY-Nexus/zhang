'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import WeddingMusicPlayerClient from '@/components/client/wedding-music-player-client'
import ScheduleSection from '@/components/client/schedule-section-client'
import Navbar from '@/components/client/navbar-client'

const FloatingAIButton = dynamic(() => import('@/components/wedding/floating-ai-button'), {
  ssr: false,
})
const MusicPlayer = WeddingMusicPlayerClient
const PWAInstallPrompt = dynamic(() => import('@/components/pwa-install-prompt'), { ssr: false })

/**
 * @file 婚礼日程页面
 * @description 展示婚礼当天的详细日程安排
 * @author YYC
 * @version 1.0.0
 */
export default function SchedulePage() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-graphite via-graphite/95 to-graphite/90">
      {/* 顶部导航栏 */}
      <Navbar currentPage="schedule" />

      {/* 主要内容 - 页面主体 */}
      <main className="pt-20 pb-24">
        <div className="container mx-auto px-4 py-12">
          <Suspense
            fallback={
              <div className="min-h-[80vh] flex items-center justify-center">加载中...</div>
            }
          >
            <ScheduleSection />
          </Suspense>
        </div>
      </main>

      {/* 浮动AI按钮 - 全局常驻 */}
      <FloatingAIButton />

      {/* 音乐播放器 - 全局常驻 */}
      <MusicPlayer />

      {/* PWA安装提示 - 智能显示 */}
      <PWAInstallPrompt />
    </div>
  )
}
