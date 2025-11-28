"use client"

import { useState, useEffect } from "react"
import EntertainmentZone from "./entertainment-zone"
import { motion, Variants } from "framer-motion"
import { Music, Video, Gamepad, Gift } from "lucide-react"

/**
 * @file 娱乐互动页面组件
 * @description 提供婚礼音乐、游戏等娱乐功能
 * @author YYC
 * @version 1.0.0
 */
export default function EntertainmentSection() {
  const [activeTab, setActiveTab] = useState("music")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 模拟加载完成
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const entertainmentTabs = [
    { id: "music", icon: <Music className="w-5 h-5" />, title: "婚礼音乐" },
    { id: "games", icon: <Gamepad className="w-5 h-5" />, title: "互动游戏" },
    { id: "videos", icon: <Video className="w-5 h-5" />, title: "精彩视频" },
    { id: "gifts", icon: <Gift className="w-5 h-5" />, title: "礼物互动" },
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
        <p className="text-muted-foreground">加载娱乐内容中...</p>
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
        <h1 className="text-3xl md:text-4xl font-bold mb-3">娱乐互动</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          享受音乐，参与互动，共同度过欢乐时光
        </p>
      </motion.div>

      {/* 娱乐分类标签 */}
      <motion.div
        variants={itemVariants}
        className="w-full max-w-4xl overflow-x-auto pb-2"
      >
        <div className="flex gap-3 min-w-max">
          {entertainmentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-lg flex items-center gap-3 transition-all ${ 
                activeTab === tab.id 
                  ? "bg-gold text-graphite font-medium shadow-md" 
                  : "bg-card/50 hover:bg-card border border-border/50" 
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.title}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* 娱乐内容区域 */}
      <motion.div
        variants={itemVariants}
        className="w-full max-w-4xl min-h-[60vh]"
      >
        <EntertainmentZone />
      </motion.div>

      {/* 互动提示 */}
      <motion.div
        variants={itemVariants}
        className="bg-card/50 rounded-lg p-4 border border-border/50 text-center max-w-4xl"
      >
        <p className="text-sm text-muted-foreground">
          💡 点击音乐即可播放，参与互动游戏赢取精美礼品，共同为新人送上祝福
        </p>
      </motion.div>
    </motion.div>
  )
}
