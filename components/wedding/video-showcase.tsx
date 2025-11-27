"use client"

import { motion } from "framer-motion"
import VideoPlayer from "./video-player"

interface VideoShowcaseProps {
  variant?: 1 | 2 | 3
}

export default function VideoShowcase({ variant = 1 }: VideoShowcaseProps) {
  // 三种不同布局样式
  
  // 样式1：左右布局，2个视频
  if (variant === 1) {
    return (
      <section className="py-20 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              📹 婚礼视频集锦
            </h2>
            <p className="text-muted-foreground">记录我们最珍贵的瞬间</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <VideoPlayer
              src="/MP4/wedding主婚1.mp4"
              title="主婚视频 · 幸福时刻"
              variant="default"
              autoPlay={true}
              loop={true}
              muted={true}
              className="h-[600px] md:h-[700px] w-full"
            />
            <VideoPlayer
              src="/MP4/wedding主婚2.mp4"
              title="主婚视频 · 甜蜜瞬间"
              variant="default"
              autoPlay={true}
              loop={true}
              muted={true}
              className="h-[600px] md:h-[700px] w-full"
            />
          </div>
        </motion.div>
      </section>
    )
  }

  // 样式2：卡片式，3个视频
  if (variant === 2) {
    return (
      <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-graphite/50 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              💖 爱的回忆
            </h2>
            <p className="text-muted-foreground">每一帧都是永恒</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <VideoPlayer
              src="/MP4/wedding主婚3.mp4"
              title="主婚视频 · 甜蜜回忆"
              variant="card"
              autoPlay={true}
              loop={true}
              muted={true}
              className="h-[500px] md:h-[600px]"
            />
            <VideoPlayer
              src="/MP4/wedding主婚4.mp4"
              title="主婚视频 · 温馨时光"
              variant="card"
              autoPlay={true}
              loop={true}
              muted={true}
              className="h-[500px] md:h-[600px]"
            />
            <VideoPlayer
              src="/MP4/wedding主婚5.mp4"
              title="主婚视频 · 浪漫瞬间"
              variant="card"
              autoPlay={true}
              loop={true}
              muted={true}
              className="h-[500px] md:h-[600px]"
            />
          </div>
        </motion.div>
      </section>
    )
  }

  // 样式3：大屏展示 + 缩略图，4个视频
  return (
    <section className="py-20 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            🎬 精彩片段
          </h2>
          <p className="text-muted-foreground">从相识到相守的美好时光</p>
        </div>

        {/* 主视频 */}
        <div className="mb-8">
          <VideoPlayer
            src="/MP4/wedding主婚6.mp4"
            title="主婚视频 · 我们的爱情故事"
            variant="default"
            autoPlay={true}
            loop={true}
            muted={true}
            className="h-[650px] md:h-[750px] w-full max-w-4xl mx-auto"
          />
        </div>

        {/* 缩略视频 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <VideoPlayer
            src="/MP4/wedding主婚7.mp4"
            title="主婚视频 · 甜蜜日常"
            variant="minimal"
            autoPlay={true}
            loop={true}
            muted={true}
            className="h-[400px] md:h-[450px]"
          />
          <VideoPlayer
            src="/MP4/wedding主婚8.mp4"
            title="主婚视频 · 幸福笑容"
            variant="minimal"
            autoPlay={true}
            loop={true}
            muted={true}
            className="h-[400px] md:h-[450px]"
          />
          <VideoPlayer
            src="/MP4/wedding主婚9.mp4"
            title="主婚视频 · 温馨时刻"
            variant="minimal"
            autoPlay={true}
            loop={true}
            muted={true}
            className="h-[400px] md:h-[450px]"
          />
        </div>
      </motion.div>
    </section>
  )
}

