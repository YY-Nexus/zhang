"use client"

import { useState, useEffect } from "react"
import VideoShowcase from "./video-showcase"
import { motion, Variants } from "framer-motion"

/**
 * @file 婚礼视频页面组件
 * @description 展示婚礼相关视频内容
 * @author YYC
 * @version 1.0.0
 */
export default function VideoSection() {
  const [activeTab, setActiveTab] = useState("ceremony")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 模拟加载完成
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const videoCategories = [
    { id: "ceremony", title: "婚礼仪式" },
    { id: "prewedding", title: "婚前拍摄" },
    { id: "celebration", title: "庆祝活动" },
    { id: "behind", title: "花絮" },
  ]

  const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
}

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-t-gold border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <p className="text-muted-foreground">加载视频中...</p>
      </div>
    )
  }

  return (
    <motion.div
      className="w-full flex flex-col items-center gap-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* 标题区域 */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">婚礼视频集锦</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          记录每一个感动瞬间，留住美好回忆
        </p>
      </motion.div>

      {/* 视频分类标签 */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap justify-center gap-3 mb-8"
      >
        {videoCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={`px-5 py-2 rounded-full transition-all ${ 
              activeTab === category.id 
                ? "bg-gold text-graphite font-medium" 
                : "bg-card/50 hover:bg-card border border-border/50" 
            }`}
          >
            {category.title}
          </button>
        ))}
      </motion.div>

      {/* 视频展示区域 */}
      <motion.div variants={itemVariants} className="w-full">
        <VideoShowcase />
      </motion.div>

      {/* 温馨提示 */}
      <motion.div
        variants={itemVariants}
        className="bg-card/50 rounded-lg p-4 border border-border/50 text-center"
      >
        <p className="text-sm text-muted-foreground">
          💡 点击视频即可播放，建议在WiFi环境下观看，享受最佳体验
        </p>
      </motion.div>
    </motion.div>
  )
}
