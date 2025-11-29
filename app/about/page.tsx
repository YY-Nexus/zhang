'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import AboutSection from '@/components/client/about-section-client'
import Navbar from '@/components/client/navbar-client'

const FloatingAIButton = dynamic(() => import('../../components/wedding/floating-ai-button'), {
  ssr: false,
})
const MusicPlayer = dynamic(() => import('../../components/wedding/music-player-new'), {
  ssr: false,
})
const PWAInstallPrompt = dynamic(() => import('../../components/pwa-install-prompt'), {
  ssr: false,
})

/**
 * @file 关于我们页面
 * @description 展示婚礼新人的个人信息和爱情故事
 * @author YYC
 * @version 1.0.0
 */
export default function AboutPage() {
  return (
    <div className="relative w-full min-h-screen bg-linear-to-b from-graphite via-graphite/95 to-graphite/90">
      {/* 顶部导航栏 */}
      <Navbar currentPage="about" />

      {/* 主要内容 - 页面主体 */}
      <main className="pt-20 pb-24">
        <div className="container mx-auto px-4 py-12">
          <Suspense
            fallback={
              <div className="min-h-[80vh] flex items-center justify-center">加载中...</div>
            }
          >
            <AboutSection />
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
