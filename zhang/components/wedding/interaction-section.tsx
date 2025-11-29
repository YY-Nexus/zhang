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
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const messagesPerPage = 10
  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "oldest">('latest')

  // 初始化 WebSocket 连接
  useEffect(() => {
    if (!guestName) return

    const client = getWebSocketClient(guestId, guestName)
    setWsClient(client)

    // 模拟连接状态（实际使用时连接真实服务器）
    setConnectionState("connecting")
    
    // 模拟连接成功
    const connectTimer = setTimeout(() => {
      setConnectionState("connected")
      // 模拟获取在线列表
      setOnlineGuests([
        { id: "g1", name: "李明", joinedAt: Date.now() - 3600000, lastActiveAt: Date.now() - 3600000 },
        { id: "g2", name: "王芳", joinedAt: Date.now() - 1800000, lastActiveAt: Date.now() - 1800000 },
        { id: "g3", name: "张伟", joinedAt: Date.now() - 600000, lastActiveAt: Date.now() - 600000 },
      ])
    }, 1000)

    // 订阅消息
    const messageHandler = (data: unknown) => {
      const msg = data as Message
      setMessages((prev) => [msg, ...prev])
    }
    client.on("message:received", messageHandler)

    // 订阅在线列表
    const guestListHandler = (data: unknown) => {
      const result = data as { guests: Guest[] }
      setOnlineGuests(result.guests)
    }
    client.on("guest:list", guestListHandler)

    return () => {
      clearTimeout(connectTimer)
      client.off("message:received", messageHandler)
      client.off("guest:list", guestListHandler)
      // 注意：不要在这里调用disconnect，因为clientInstance是单例，其他组件可能还在使用
      // client.disconnect()
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

  // 加载更多消息
  const loadMoreMessages = async () => {
    if (isLoading || !hasMore) return
    
    setIsLoading(true)
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟加载更多消息（实际应该从服务器获取）
      const moreMessages: Message[] = Array.from({ length: 5 }, (_, i) => ({
        id: `msg_${Date.now()}_${i}`,
        guestId: `g_${Date.now()}_${i}`,
        guestName: `嘉宾${Date.now() % 1000}`,
        content: `这是第${currentPage + 1}页的祝福消息 ${i + 1}：祝福新人百年好合，永结同心！`,
        timestamp: Date.now() - (currentPage + 1) * 3600000 - i * 60000,
        likes: Math.floor(Math.random() * 20),
        likedBy: [],
      }))
      
      if (moreMessages.length > 0) {
        setMessages(prev => [...prev, ...moreMessages])
        setCurrentPage(prev => prev + 1)
        setHasMore(moreMessages.length === messagesPerPage)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("加载更多消息失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 过滤和排序消息
  const filteredAndSortedMessages = messages.filter(message => {
    const searchLower = searchTerm.toLowerCase()
    return (
      message.guestName.toLowerCase().includes(searchLower) ||
      message.content.toLowerCase().includes(searchLower)
    )
  }).sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return b.timestamp - a.timestamp
      case 'popular':
        return b.likes - a.likes
      case 'oldest':
        return a.timestamp - b.timestamp
      default:
        return b.timestamp - a.timestamp
    }
  })

  // 计算当前显示的消息
  const displayedMessages = filteredAndSortedMessages.slice(0, currentPage * messagesPerPage)

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
                  className="w-full min-h-[44px] bg-gold hover:bg-gold-dark text-graphite font-semibold py-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  aria-label="发送祝福留言"
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
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-gold fill-gold" />
                  最新祝福
                  <span className="text-sm font-normal text-muted-foreground">({filteredAndSortedMessages.length} 条)</span>
                </h3>
                
                {/* 搜索和筛选 */}
                <div className="space-y-4">
                  {/* 搜索框 */}
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="搜索祝福内容或嘉宾姓名..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1) // 重置到第一页
                      }}
                      className="pl-10"
                    />
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                    {searchTerm && (
                      <button
                        onClick={() => {
                          setSearchTerm("")
                          setCurrentPage(1) // 重置到第一页
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  
                  {/* 排序选项 */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">排序：</span>
                    <div className="flex gap-1">
                      {[
                        { value: 'latest', label: '最新' },
                        { value: 'popular', label: '热门' },
                        { value: 'oldest', label: '最早' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value as 'latest' | 'popular' | 'oldest')
                            setCurrentPage(1) // 重置到第一页
                          }}
                          className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            sortBy === option.value
                              ? 'bg-gold text-graphite'
                              : 'bg-card text-muted-foreground hover:bg-gold/10 hover:text-gold'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent">
                <AnimatePresence mode="popLayout">
                  {displayedMessages.map((message) => (
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
              
              {/* 加载更多按钮 */}
              <div className="flex justify-center mt-4">
                <Button
                  onClick={loadMoreMessages}
                  disabled={isLoading || !hasMore}
                  variant="outline"
                  className="w-full max-w-xs min-h-[44px] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  aria-label={hasMore ? "加载更多祝福" : "没有更多消息了"}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                      加载中...
                    </span>
                  ) : hasMore ? (
                    "加载更多祝福"
                  ) : (
                    "没有更多消息了"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
