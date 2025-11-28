'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import WeddingMusicPlayerClient from '@/components/client/wedding-music-player-client'
import PageNavigation, { type PageConfig } from '@/components/client/page-navigation-client'
import HeroSection from '@/components/client/hero-section-client'
import CountdownSection from '@/components/client/countdown-section-client'
import AboutSection from '@/components/client/about-section-client'
import ScheduleSection from '@/components/client/schedule-section-client'
import GallerySection from '@/components/client/gallery-section-client'
import InteractionSection from '@/components/client/interaction-section-client'
import EntertainmentZone from '@/components/client/entertainment-zone-client'
import ChatRoom from '@/components/client/chat-room-client'
import GuestSignIn from '@/components/client/guest-sign-in-client'
import Footer from '@/components/client/footer-client'
import VideoShowcase from '@/components/client/video-showcase-client'

const FloatingAIButton = dynamic(() => import('@/components/wedding/floating-ai-button'), {
  ssr: false,
})
// Use the existing client wrapper (which itself dynamic-imports the actual player)
const MusicPlayer = WeddingMusicPlayerClient
const PWAInstallPrompt = dynamic(() => import('@/components/pwa-install-prompt'), { ssr: false })

// 页面1: 首页 - Hero + 倒计时
const HomePage = () => (
  <div className="relative w-full h-full">
    <Suspense fallback={<div className="h-full bg-background" />}>
      <HeroSection />
    </Suspense>
  </div>
)

// 页面2: 关于我们 + 视频展示1
const AboutPage = () => (
  <div className="relative w-full h-full overflow-y-auto">
    <AboutSection />
    <VideoShowcase variant={1} />
  </div>
)

// 页面3: 日程安排
const SchedulePage = () => (
  <div className="relative w-full h-full overflow-y-auto">
    <ScheduleSection />
  </div>
)

// 页面4: 照片画廊 + 视频展示2
const GalleryPage = () => (
  <div className="relative w-full h-full overflow-y-auto">
    <GallerySection />
    <VideoShowcase variant={2} />
  </div>
)

// 页面5: 娱乐休闲区
const EntertainmentPage = () => (
  <div className="relative w-full h-full overflow-hidden">
    <EntertainmentZone />
  </div>
)

// 页面6: 聊天室 + 视频展示3
const ChatPage = () => (
  <div className="relative w-full h-full overflow-y-auto">
    <ChatRoom />
    <VideoShowcase variant={3} />
  </div>
)

// 页面7: 互动区 - 留言/RSVP
const InteractionPage = () => (
  <div className="relative w-full h-full overflow-y-auto">
    <InteractionSection />
    <Footer />
  </div>
)

export default function PaginatedWedding() {
  const pages: PageConfig[] = [
    {
      id: 'home',
      title: '首页',
      emoji: '💒',
      component: <HomePage />,
      bgGradient: 'bg-linear-to-b from-graphite via-graphite/95 to-graphite/90',
    },
    {
      id: 'about',
      title: '关于我们',
      emoji: '💕',
      component: <AboutPage />,
      bgGradient: 'bg-linear-to-br from-rose-900/20 via-graphite to-graphite',
    },
    {
      id: 'schedule',
      title: '婚礼日程',
      emoji: '📅',
      component: <SchedulePage />,
      bgGradient: 'bg-linear-to-br from-blue-900/20 via-graphite to-graphite',
    },
    {
      id: 'gallery',
      title: '照片画廊',
      emoji: '📸',
      component: <GalleryPage />,
      bgGradient: 'bg-linear-to-br from-purple-900/20 via-graphite to-graphite',
    },
    {
      id: 'videos',
      title: '婚礼视频',
      emoji: '🎬',
      component: <VideoShowcase variant={1} />,
      bgGradient: 'bg-linear-to-br from-emerald-900/20 via-graphite to-graphite',
    },
    {
      id: 'entertainment',
      title: '娱乐休闲',
      emoji: '🎮',
      component: <EntertainmentPage />,
      bgGradient: 'bg-linear-to-br from-indigo-900/20 via-graphite to-graphite',
    },
    {
      id: 'chat',
      title: '聊天室',
      emoji: '💬',
      component: <ChatPage />,
      bgGradient: 'bg-linear-to-br from-green-900/20 via-graphite to-graphite',
    },
    {
      id: 'interaction',
      title: '互动留言',
      emoji: '✍️',
      component: <InteractionPage />,
      bgGradient: 'bg-linear-to-br from-amber-900/20 via-graphite to-graphite',
    },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* 浮动AI按钮 - 全局常驻 */}
      <FloatingAIButton />

      {/* 音乐播放器 - 全局常驻 */}
      <MusicPlayer />

      {/* PWA安装提示 - 智能显示 */}
      <PWAInstallPrompt />

      {/* 分页导航系统 */}
      <PageNavigation pages={pages} initialPage={0} />
    </main>
  )
}
