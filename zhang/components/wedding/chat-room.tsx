"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Heart, Smile, Image as ImageIcon, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTypewriter } from "@/hooks/useTypewriter"

interface ChatMessage {
  id: string
  username: string
  avatar: string
  message: string
  timestamp: Date
  likes: number
  isSystem?: boolean
}

// 预设的祝福表情
const blessingEmojis = [
  "💕", "🎉", "🎊", "✨", "💐", "🌹", "🎈", "🎁",
  "💖", "💝", "🥂", "🍾", "👏", "🎵", "🎶", "💫"
]

// 模拟在线用户
const mockUsers = [
  { name: "张三", avatar: "👨" },
  { name: "李四", avatar: "👩" },
  { name: "王五", avatar: "🧑" },
  { name: "赵六", avatar: "👨‍💼" },
  { name: "孙七", avatar: "👩‍💼" },
]

export default function ChatRoom() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "system-1",
      username: "婚礼助手",
      avatar: "🤖",
      message: "🎊 欢迎来到婚礼聊天室！大家可以在这里畅所欲言，分享祝福！",
      timestamp: new Date(),
      likes: 0,
      isSystem: true,
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<{ name: string; avatar: string } | null>(null)
  const [onlineCount, setOnlineCount] = useState(8)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 初始化用户
  useEffect(() => {
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
    setCurrentUser(randomUser)
  }, [])

  // 自动滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 模拟其他用户发言
  useEffect(() => {
    const mockMessages = [
      "新婚快乐！百年好合！🎉",
      "祝福新人！永结同心！💕",
      "太感动了，祝你们幸福！😭",
      "恭喜恭喜！早生贵子！🎊",
      "好漂亮的婚礼！✨",
      "祝福新人白头偕老！💖",
    ]

    const interval = setInterval(() => {
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
      const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)]

      const newMessage: ChatMessage = {
        id: `mock-${Date.now()}`,
        username: randomUser.name,
        avatar: randomUser.avatar,
        message: randomMessage,
        timestamp: new Date(),
        likes: Math.floor(Math.random() * 5),
      }

      setMessages((prev) => [...prev, newMessage])
      setOnlineCount((prev) => Math.max(5, prev + Math.floor(Math.random() * 3) - 1))
    }, 10000) // 每10秒一条消息

    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !currentUser) return

    const newMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      username: currentUser.name,
      avatar: currentUser.avatar,
      message: inputMessage,
      timestamp: new Date(),
      likes: 0,
    }

    setMessages((prev) => [...prev, newMessage])
    setInputMessage("")
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  const handleLike = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg
      )
    )
  }

  const handleEmojiClick = (emoji: string) => {
    setInputMessage((prev) => prev + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-linear-to-br from-graphite via-graphite/95 to-graphite/90">
      {/* 顶部标题栏 */}
      <div className="flex-shrink-0 bg-card/80 backdrop-blur-xl border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              💬 婚礼聊天室
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              在线人数：<span className="text-gold font-medium">{onlineCount}</span> 人
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
            <span className="text-sm text-green-500">在线</span>
          </div>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.username === currentUser?.name ? "flex-row-reverse" : ""}`}
              >
                {/* 头像 */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    msg.isSystem
                      ? "bg-gold/20"
                      : msg.username === currentUser?.name
                        ? "bg-blue-500/20"
                        : "bg-muted"
                  }`}
                >
                  {msg.avatar}
                </div>

                {/* 消息内容 */}
                <div
                  className={`flex-1 max-w-md ${msg.username === currentUser?.name ? "items-end" : "items-start"} flex flex-col gap-1`}
                >
                  <div className={`flex items-center gap-2 ${msg.username === currentUser?.name ? "flex-row-reverse" : ""}`}>
                    <span className="text-sm font-medium text-foreground">
                      {msg.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {msg.timestamp.toLocaleTimeString("zh-CN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div
                    className={`relative px-4 py-2 rounded-2xl ${
                      msg.isSystem
                        ? "bg-gold/10 text-gold border border-gold/20"
                        : msg.username === currentUser?.name
                          ? "bg-gold text-graphite rounded-br-sm"
                          : "bg-card text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {msg.message}
                    </p>
                  </div>

                  {/* 点赞按钮 */}
                  {!msg.isSystem && (
                    <button
                      onClick={() => handleLike(msg.id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors"
                    >
                      <Heart className={`w-3 h-3 ${msg.likes > 0 ? "fill-gold text-gold" : ""}`} />
                      {msg.likes > 0 && <span>{msg.likes}</span>}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="flex-shrink-0 bg-card/80 backdrop-blur-xl border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2">
            {/* Emoji选择器 */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="bg-transparent"
              >
                <Smile className="w-5 h-5" />
              </Button>

              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full mb-2 left-0 bg-card rounded-xl border border-border shadow-xl p-3 grid grid-cols-8 gap-2 w-80"
                  >
                    {blessingEmojis.map((emoji, index) => (
                      <motion.button
                        key={emoji}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => handleEmojiClick(emoji)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 flex items-center justify-center text-xl hover:bg-muted rounded-lg transition-colors"
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 输入框 */}
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              placeholder="输入消息...按Enter发送"
              className="flex-1 bg-background"
            />

            {/* 发送按钮 */}
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="bg-gold hover:bg-gold/90 text-graphite"
            >
              <Send className="w-4 h-4 mr-2" />
              发送
            </Button>
          </div>

          {/* 提示文字 */}
          <p className="text-xs text-muted-foreground mt-2 text-center">
            💡 在这里分享您的祝福，与其他来宾互动交流
          </p>
        </div>
      </div>
    </div>
  )
}

