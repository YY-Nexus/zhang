"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Send, Heart, User, Wifi, WifiOff, Users } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getWebSocketClient, type WeddingWebSocketClient } from "@/lib/websocket-client"
import type { Message, Guest } from "@/lib/websocket-architecture"

// 模拟初始数据
const mockMessages: Message[] = [
  {
    id: "1",
    guestId: "g1",
    guestName: "李明",
    content: "祝福新人百年好合，早生贵子！",
    timestamp: Date.now() - 120000,
    likes: 12,
    likedBy: [],
  },
  {
    id: "2",
    guestId: "g2",
    guestName: "王芳",
    content: "太幸福了！婚礼当天一定到场！",
    timestamp: Date.now() - 300000,
    likes: 8,
    likedBy: [],
  },
  {
    id: "3",
    guestId: "g3",
    guestName: "张伟",
    content: "恭喜恭喜！祝永结同心，白头偕老！",
    timestamp: Date.now() - 600000,
    likes: 15,
    likedBy: [],
  },
]

export default function InteractionSection() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [guestName, setGuestName] = useState("")
  const [guestId] = useState(() => `guest_${Date.now()}`)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [connectionState, setConnectionState] = useState<"disconnected" | "connecting" | "connected" | "degraded">(
    "disconnected",
  )
  const [onlineGuests, setOnlineGuests] = useState<Guest[]>([])
  const [wsClient, setWsClient] = useState<WeddingWebSocketClient | null>(null)

  // 初始化 WebSocket 连接
  useEffect(() => {
    if (!guestName) return

    const client = getWebSocketClient(guestId, guestName)
    setWsClient(client)

    // 模拟连接状态（实际使用时连接真实服务器）
    setConnectionState("connected")

    // 订阅消息
    client.on("message:received", (data) => {
      const msg = data as Message
      setMessages((prev) => [msg, ...prev])
    })

    // 订阅在线列表
    client.on("guest:list", (data) => {
      const result = data as { guests: Guest[] }
      setOnlineGuests(result.guests)
    })

    return () => {
      client.disconnect()
    }
  }, [guestId, guestName])

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    if (diff < 60000) return "刚刚"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    return new Date(timestamp).toLocaleDateString()
  }

  // 发送消息
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !guestName.trim()) return

    setIsSubmitting(true)

    // 模拟发送（实际使用 WebSocket）
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      guestId,
      guestName,
      content: newMessage,
      timestamp: Date.now(),
      likes: 0,
      likedBy: [],
    }

    // 乐观更新
    setMessages((prev) => [newMsg, ...prev])
    setNewMessage("")
    setIsSubmitting(false)

    // 实际发送
    if (wsClient) {
      const result = await wsClient.sendMessage(newMessage)
      if (!result.success) {
        // 回滚
        setMessages((prev) => prev.filter((m) => m.id !== newMsg.id))
      }
    }
  }

  // 点赞
  const handleLike = useCallback(
    (messageId: string) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, likes: msg.likes + 1, likedBy: [...msg.likedBy, guestId] } : msg,
        ),
      )
    },
    [guestId],
  )

  // 连接状态指示器
  const ConnectionIndicator = () => {
    const stateConfig = {
      disconnected: { icon: WifiOff, color: "text-red-500", label: "未连接" },
      connecting: { icon: Wifi, color: "text-yellow-500 animate-pulse", label: "连接中..." },
      connected: { icon: Wifi, color: "text-green-500", label: "已连接" },
      degraded: { icon: Wifi, color: "text-orange-500", label: "兼容模式" },
    }
    const config = stateConfig[connectionState]
    const Icon = config.icon

    return (
      <div className="flex items-center gap-2 text-sm">
        <Icon className={`w-4 h-4 ${config.color}`} />
        <span className="text-muted-foreground">{config.label}</span>
        {onlineGuests.length > 0 && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-3 h-3" />
            {onlineGuests.length} 在线
          </span>
        )}
      </div>
    )
  }

  return (
    <section id="rsvp" className="relative py-20 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm tracking-widest uppercase">Guest Book</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2">祝福留言</h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">写下您对新人的美好祝福</p>
          <div className="mt-4 flex justify-center">
            <ConnectionIndicator />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* 留言表单 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 md:p-8 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-gold" />
                发送祝福
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">您的姓名</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="请输入您的姓名"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">祝福留言</label>
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="写下您对新人的祝福..."
                    rows={4}
                    maxLength={500}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">{newMessage.length}/500</p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !guestName.trim()}
                  className="w-full bg-gold hover:bg-gold-dark text-graphite font-semibold py-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-graphite/30 border-t-graphite rounded-full animate-spin" />
                      发送中...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      发送祝福
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>

          {/* 留言墙 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-gold fill-gold" />
              最新祝福
              <span className="text-sm font-normal text-muted-foreground">({messages.length} 条)</span>
            </h3>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-card rounded-xl p-4 border border-border hover:border-gold/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-semibold">
                          {message.guestName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{message.guestName}</h4>
                          <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLike(message.id)}
                        disabled={message.likedBy.includes(guestId)}
                        className={`flex items-center gap-1 transition-colors ${
                          message.likedBy.includes(guestId) ? "text-gold" : "text-muted-foreground hover:text-gold"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${message.likedBy.includes(guestId) ? "fill-gold" : ""}`} />
                        <span className="text-xs">{message.likes}</span>
                      </motion.button>
                    </div>
                    <p className="text-foreground text-sm leading-relaxed pl-13">{message.content}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
