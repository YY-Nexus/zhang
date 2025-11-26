"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
import {
  Sparkles,
  X,
  Phone,
  MapPin,
  Music,
  Calendar,
  Send,
  Users,
  GripHorizontal,
  CheckCircle,
} from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DraggableModal from "./draggable-modal"
import MusicModalContent from "./modal-contents/music-modal"
import RSVPModalContent from "./modal-contents/rsvp-modal"
import GuestListModalContent from "./modal-contents/guest-list-modal"
import ContactModalContent from "./modal-contents/contact-modal"
import { chatTemplates } from "@/lib/ai-chat-templates"

const quickActions = [
  { icon: MapPin, label: "导航", action: "navigate_to_venue", emoji: "📍" },
  { icon: CheckCircle, label: "签到", action: "guest_checkin", emoji: "✅" },
  { icon: Music, label: "音乐", action: "play_music", emoji: "🎵" },
  { icon: Calendar, label: "RSVP", action: "rsvp_confirm", emoji: "📝" },
  { icon: Phone, label: "呼叫", action: "call_contact", emoji: "📞" },
]

type ModalType = "music" | "rsvp" | "guests" | "contact" | null

export default function FloatingAIButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [chatMessages, setChatMessages] = useState<{ role: "ai" | "user"; content: string }[]>([])
  const dragControls = useDragControls()

  // 打开面板时显示随机开场话术
  useEffect(() => {
    if (isOpen && chatMessages.length === 0) {
      const randomGreeting = chatTemplates.greetings[Math.floor(Math.random() * chatTemplates.greetings.length)]
      setChatMessages([{ role: "ai", content: randomGreeting }])
    }
  }, [isOpen, chatMessages.length])

  const handleAction = (action: string) => {
    const shortcut = chatTemplates.shortcuts.find((s) => s.command === action)
    const actionLabel = shortcut ? `${shortcut.emoji} ${shortcut.label}` : action

    switch (action) {
      case "navigate_to_venue":
        window.open(
          "https://maps.apple.com/place?address=%E4%B8%AD%E5%9B%BD%E6%B2%B3%E5%8D%97%E7%9C%81%E6%B4%9B%E9%98%B3%E5%B8%82%E5%AD%9F%E6%B4%A5%E5%8C%BA%E9%BA%BB%E5%B1%AF%E9%95%87%E5%9C%9F%E5%9C%B0%E6%89%80%E5%AF%B9%E9%9D%A2&coordinate=34.734682,112.367732&name=%E5%AF%8C%E8%B1%AA%E5%A4%A7%E9%85%92%E5%BA%97(%E9%98%BF%E6%96%B0%E5%A4%A7%E9%81%93%E5%BA%97)",
          "_blank",
        )
        setChatMessages((prev) => [...prev, { role: "ai", content: "📍 已为您打开导航，祝您一路顺风！" }])
        break
      case "call_contact":
        setChatMessages((prev) => [...prev, { role: "ai", content: "📞 正在为您拨打新人电话..." }])
        setActiveModal("contact")
        break
      case "contact_couple":
        setActiveModal("contact")
        break
      case "play_music":
        setActiveModal("music")
        setChatMessages((prev) => [...prev, { role: "ai", content: "🎵 为您打开婚礼音乐播放器～" }])
        break
      case "guest_checkin":
      case "rsvp_confirm":
        setActiveModal("rsvp")
        setChatMessages((prev) => [...prev, { role: "ai", content: "📝 请填写您的出席信息～" }])
        break
      case "guests":
        setActiveModal("guests")
        break
    }
  }

  const handleSend = () => {
    if (!message.trim()) return
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: message },
      { role: "ai", content: "💕 感谢您的消息！新人会非常开心收到您的祝福。" },
    ])
    setMessage("")
  }

  const handleShortcutClick = (command: string) => {
    const shortcut = chatTemplates.shortcuts.find((s) => s.command === command)
    if (shortcut) {
      setChatMessages((prev) => [...prev, { role: "user", content: `${shortcut.emoji} ${shortcut.label}` }])
      handleAction(command)
    }
  }

  return (
    <>
      {/* 触发按钮 - 左上角，带微振动动效 */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        whileHover={{
          scale: 1.1,
          transition: { duration: 0.15 },
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`
          fixed top-4 left-4 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full
          bg-gold/80 backdrop-blur-sm text-graphite
          flex items-center justify-center
          shadow-lg shadow-gold/30
          hover:bg-gold
          transition-colors duration-300
          ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
        aria-label="打开AI助手"
      >
        <Sparkles className="w-6 h-6" />
        {/* 脉冲动画环 */}
        <span className="absolute inset-0 rounded-full bg-gold/30 animate-ping" />
      </motion.button>

      {/* AI面板 - 可拖拽 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-graphite/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none md:pointer-events-none"
              onClick={() => setIsOpen(false)}
            />

            {/* 面板 - 增强动画 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, y: -20, filter: "blur(10px)" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              drag
              dragControls={dragControls}
              dragMomentum={false}
              dragElastic={0.1}
              className="fixed top-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-sm bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border overflow-hidden"
              style={{ touchAction: "none" }}
            >
              {/* 头部 - 拖拽手柄 */}
              <div
                className="flex items-center justify-between p-4 bg-gold/10 border-b border-border cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-graphite" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">婚礼AI助手</h3>
                    <p className="text-xs text-muted-foreground">随时为您服务</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <GripHorizontal className="w-5 h-5 text-muted-foreground" />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                    aria-label="关闭"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 快捷操作 */}
              <div className="p-4 border-b border-border">
                <p className="text-xs text-muted-foreground mb-3">快捷操作</p>
                <div className="grid grid-cols-5 gap-2">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.action}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShortcutClick(action.action)}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gold/10 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                        <span className="text-sm">{action.emoji}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground text-center leading-tight">
                        {action.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 对话区域 */}
              <div className="h-48 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
                        msg.role === "user" ? "bg-gold text-graphite" : "bg-muted text-foreground"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 输入区域 */}
              <div className="p-4 border-t border-border flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="输入祝福或问题..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button onClick={handleSend} size="icon" className="bg-gold hover:bg-gold/90 text-graphite">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 各种功能弹窗 */}
      <DraggableModal
        isOpen={activeModal === "music"}
        onClose={() => setActiveModal(null)}
        title="婚礼音乐"
        icon={<Music className="w-5 h-5" />}
        width="max-w-md"
      >
        <MusicModalContent />
      </DraggableModal>

      <DraggableModal
        isOpen={activeModal === "rsvp"}
        onClose={() => setActiveModal(null)}
        title="来宾签到"
        icon={<Calendar className="w-5 h-5" />}
        width="max-w-md"
      >
        <RSVPModalContent />
      </DraggableModal>

      <DraggableModal
        isOpen={activeModal === "guests"}
        onClose={() => setActiveModal(null)}
        title="来宾名册"
        icon={<Users className="w-5 h-5" />}
        width="max-w-lg"
      >
        <GuestListModalContent />
      </DraggableModal>

      <DraggableModal
        isOpen={activeModal === "contact"}
        onClose={() => setActiveModal(null)}
        title="联系我们"
        icon={<Phone className="w-5 h-5" />}
        width="max-w-md"
      >
        <ContactModalContent />
      </DraggableModal>
    </>
  )
}
