'use client'

import { Suspense } from 'react'
import HeroSection from '../../components/wedding/hero-section'
import MusicPlayer from '../../components/wedding/music-player-final'
import PWAInstallPrompt from '../../components/pwa-install-prompt'
import Navbar from '../../components/wedding/navbar'
import BigModelDemoClient from '../../components/client/bigmodel-demo-client'

/**
 * @file 首页路由
 * @description 婚礼网站首页，展示hero区域和倒计时
 * @author YYC
 * @version 1.0.0
 */
export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-graphite via-graphite/95 to-graphite/90">
      {/* 顶部导航栏 */}
      <Navbar currentPage="home" />

      {/* 主要内容 - 页面主体 */}
      <main className="pt-20 pb-24">
        <div className="container mx-auto px-4 py-12">
          <Suspense
            fallback={
              <div className="min-h-[80vh] flex items-center justify-center">加载中...</div>
            }
          >
            <HeroSection />
          </Suspense>

          {/* BigModel AI Demo */}
          <div className="mt-12">
            <BigModelDemoClient />
          </div>
        </div>
      </main>

      {/* 浮动AI按钮已在根布局中全局渲染 */}

      {/* 音乐播放器 - 全局常驻 */}
      <MusicPlayer />

      {/* PWA安装提示 - 智能显示 */}
      <PWAInstallPrompt />
    </div>
  )
}
