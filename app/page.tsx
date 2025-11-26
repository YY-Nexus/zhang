import { Suspense } from "react"
import HeroSection from "@/components/wedding/hero-section"
import CountdownSection from "@/components/wedding/countdown-section"
import AboutSection from "@/components/wedding/about-section"
import ScheduleSection from "@/components/wedding/schedule-section"
import GallerySection from "@/components/wedding/gallery-section"
import InteractionSection from "@/components/wedding/interaction-section"
import FloatingAIButton from "@/components/wedding/floating-ai-button"
import MusicPlayer from "@/components/wedding/music-player"
import GuestSignIn from "@/components/wedding/guest-sign-in"
import Footer from "@/components/wedding/footer"

export default function WeddingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      {/* 浮动AI按钮 - 左上角常驻 */}
      <FloatingAIButton />

      {/* 音乐播放器 - 右下角常驻 */}
      <MusicPlayer />

      {/* Hero区 - 3D无框画廊 */}
      <Suspense fallback={<div className="h-screen bg-background" />}>
        <HeroSection />
      </Suspense>

      {/* 倒计时区 */}
      <CountdownSection />

      {/* 关于我们 */}
      <AboutSection />

      {/* 日程与地点 */}
      <ScheduleSection />

      {/* 3D画廊互动区 */}
      <GallerySection />

      {/* 互动区 - 留言/RSVP */}
      <InteractionSection />

      {/* 来宾签到入口 */}
      <GuestSignIn />

      {/* 页脚 */}
      <Footer />
    </main>
  )
}
