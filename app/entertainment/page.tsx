"use client"

import { Suspense } from "react"
import dynamic from 'next/dynamic'
import EntertainmentSection from "../../components/wedding/entertainment-section"
const FloatingAIButton = dynamic(() => import('../../components/wedding/floating-ai-button'), { ssr: false })
import MusicPlayer from "../../components/wedding/music-player-new"
import PWAInstallPrompt from "../../components/pwa-install-prompt"
import Navbar from "../../components/wedding/navbar"

/**
 * @file 娱乐休闲页面
 * @description 提供婚礼娱乐互动功能
 * @author YYC
 * @version 1.0.0
 */
export default function EntertainmentPage() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-graphite via-graphite/95 to-graphite/90">
      {/* 顶部导航栏 */}
      <Navbar currentPage="entertainment" />
      
      {/* 主要内容 - 页面主体 */}
      <main className="pt-20 pb-24">
        <div className="container mx-auto px-4 py-12">
          <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">加载中...</div>}>
            <EntertainmentSection />
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
