"use client"

import { useState, useEffect } from "react"
import ChatRoom from "./chat-room"
import { motion, Variants } from "framer-motion"
import { MessageSquare, Users, Heart, Gift } from "lucide-react"

/**
 * @file 聊天室页面组件
 * @description 提供婚礼实时聊天互动功能
 * @author YYC
 * @version 1.0.0
 */
export default function ChatSection() {
  const [activeTab, setActiveTab] = useState("main")
  const [isLoading, setIsLoading] = useState(true)
  const [onlineCount, setOnlineCount] = useState(0)

  useEffect(() => {
    // 模拟加载完成
    const timer = setTimeout(() => {
      setIsLoading(false)
      // 模拟在线人数
      setOnlineCount(Math.floor(Math.random() * 50) + 20)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  const chatTabs = [
    { id: "main", icon: <MessageSquare className="w-4 h-4" />, title: "主聊天室" },
    { id: "private", icon: <Users className="w-4 h-4" />, title: "好友私聊" },
    { id: "gifts", icon: <Gift className="w-4 h-4" />, title: "礼物墙" },
    { id: "hearts", icon: <Heart className="w-4 h-4" />, title: "祝福墙" },
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
        <p className="text-muted-foreground">正在连接聊天室...</p>
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
        <h1 className="text-3xl md:text-4xl font-bold mb-3">婚礼聊天室</h1>
        <div className="flex items-center justify-center gap-3 text-muted-foreground">
          <p className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>在线人数: {onlineCount}</span>
          </p>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
          <p>实时分享喜悦，送上祝福</p>
        </div>
      </motion.div>

      {/* 聊天室标签 */}
      <motion.div
        variants={itemVariants}
        className="w-full max-w-4xl overflow-x-auto pb-2"
      >
        <div className="flex gap-2 min-w-max">
          {chatTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${ 
                activeTab === tab.id 
                  ? "bg-gold text-graphite font-medium" 
                  : "bg-card/50 hover:bg-card border border-border/50" 
              }`}
            >
              {tab.icon}
              <span>{tab.title}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* 聊天内容区域 */}
      <motion.div
        variants={itemVariants}
        className="w-full max-w-4xl min-h-[60vh] bg-card/30 rounded-xl border border-border/50 overflow-hidden"
      >
        {activeTab === "main" && <ChatRoom />}
        {activeTab !== "main" && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6">
            <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center">
              {chatTabs.find(tab => tab.id === activeTab)?.icon}
            </div>
            <p className="text-muted-foreground">
              {activeTab === "private" && "私密聊天功能即将开放"}
              {activeTab === "gifts" && "礼物墙功能即将开放"}
              {activeTab === "hearts" && "祝福墙功能即将开放"}
            </p>
          </div>
        )}
      </motion.div>

      {/* 温馨提示 */}
      <motion.div
        variants={itemVariants}
        className="bg-card/50 rounded-lg p-4 border border-border/50 text-center max-w-4xl"
      >
        <p className="text-sm text-muted-foreground">
          💡 请文明用语，共同维护良好的聊天环境，一起分享婚礼的喜悦时刻
        </p>
      </motion.div>
    </motion.div>
  )
}
