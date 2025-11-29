'use client'

import {
  Calendar,
  CheckCircle,
  GripHorizontal,
  MapPin,
  Music,
  Phone,
  Send,
  Sparkles,
  Users,
  X,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTypewriter } from '@/hooks/useTypewriter'
import { chatTemplates, getSmartReply } from '@/lib/ai-chat-templates'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import DraggableModal from './draggable-modal'
import ContactModalContent from './modal-contents/contact-modal'
import GuestListModalContent from './modal-contents/guest-list-modal'
import MusicModalContent from './modal-contents/music-modal'
import RSVPModalContent from './modal-contents/rsvp-modal'
import InvitationCard from './invitation-card'

const quickActions = [
  { icon: MapPin, label: '导航', action: 'navigate_to_venue', emoji: '📍' },
  { icon: CheckCircle, label: '签到', action: 'guest_checkin', emoji: '✅' },
  { icon: Music, label: '音乐', action: 'play_music', emoji: '🎵' },
  { icon: Calendar, label: 'RSVP', action: 'rsvp_confirm', emoji: '📝' },
  { icon: Phone, label: '呼叫', action: 'call_contact', emoji: '📞' },
  { icon: Sparkles, label: '邀请函', action: 'view_invitation', emoji: '💌' },
]

type ModalType = 'music' | 'rsvp' | 'guests' | 'contact' | 'invitation' | null

interface ChatMessage {
  role: 'ai' | 'user'
  content: string
  timestamp: Date
}

// 打字机消息组件
function TypewriterMessage({ content }: { content: string }) {
  const { displayedText, isTyping } = useTypewriter({
    text: content,
    speed: 30,
    delay: 100,
  })

  return (
    <div className="whitespace-pre-wrap">
      {displayedText}
      {isTyping && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-1 h-4 bg-current ml-0.5"
        />
      )}
    </div>
  )
}

export default function FloatingAIButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isAITyping, setIsAITyping] = useState(false)
  const [usedGreetings, setUsedGreetings] = useState<Set<number>>(new Set())
  const chatEndRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()

  // 自动滚动到最新消息
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // 监听打开邀请函事件
  useEffect(() => {
    const handleOpenInvitation = () => {
      setIsOpen(true)
      setTimeout(() => {
        setIsAITyping(true)
        setTimeout(() => {
          setActiveModal('invitation')
          setChatMessages(prev => [
            ...prev,
            {
              role: 'ai',
              content: '💌 邀请函来啦！\n包含婚礼时间、地点、导航和联系方式～\n可以保存或分享给朋友哦！\n点击查看完整邀请函！🎊',
              timestamp: new Date(),
            },
          ])
          setIsAITyping(false)
        }, 600)
      }, 300)
    }
    window.addEventListener('openInvitation', handleOpenInvitation)
    return () => window.removeEventListener('openInvitation', handleOpenInvitation)
  }, [])

  // 打开面板时显示随机开场话术（不重复）
  useEffect(() => {
    if (isOpen && chatMessages.length === 0) {
      const availableIndices = Array.from(
        { length: chatTemplates.greetings.length },
        (_, i) => i
      ).filter(i => !usedGreetings.has(i))

      const randomIndex =
        availableIndices.length > 0
          ? availableIndices[Math.floor(Math.random() * availableIndices.length)]
          : Math.floor(Math.random() * chatTemplates.greetings.length)

      setUsedGreetings(prev => new Set([...prev, randomIndex]))
      const randomGreeting = chatTemplates.greetings[randomIndex]

      setChatMessages([
        {
          role: 'ai',
          content: randomGreeting,
          timestamp: new Date(),
        },
      ])
    }
  }, [isOpen, chatMessages.length, usedGreetings])

  const handleAction = (action: string) => {
    setIsAITyping(true)

    setTimeout(() => {
      let aiResponse = ''

      switch (action) {
        case 'navigate_to_venue':
          {
            const { openNavigation } = require('@/lib/navigation-utils')
            openNavigation()
          }
          aiResponse =
            '📍 好嘞！导航已为您打开！\n富豪大酒店等着您呢～记得带上好心情！\n预计车程？跟着导航走准没错！一路顺风！🚗✨'
          break

        case 'call_contact':
          aiResponse =
            '📞 马上给您接通新人电话！\n请稍等，拨号中...嘟嘟嘟～\n记得说话温柔点，新人今天可是主角！😊'
          setActiveModal('contact')
          break

        case 'contact_couple':
          aiResponse =
            '💌 联系方式来啦！\n新郎张波：187-3639-6660\n新娘邓芮：191-0389-5555\n想直接拨打吗？点下面的呼叫按钮哦！📱'
          setActiveModal('contact')
          break

        case 'play_music':
          aiResponse =
            '🎵 音乐播放器已就位！20首经典婚礼曲目等您点播～\n喜欢哪首就投票，票数高的优先播放哦！\n来，一起嗨起来！🎉'
          setActiveModal('music')
          break

        case 'guest_checkin':
          aiResponse =
            '✅ 欢迎签到！请填写您的大名和联系方式～\n签完名别忘了写几句祝福，新人超期待的！\n对了，记得告诉我们您带几位家人来，方便安排座位！😊'
          setActiveModal('rsvp')
          break

        case 'rsvp_confirm':
          aiResponse =
            '📝 RSVP表单已备好！填一填让新人心里有个数～\n需要特殊餐食？有忌口？统统告诉我！\n咱们一定给您安排得明明白白！👨‍🍳'
          setActiveModal('rsvp')
          break

        case 'guests':
          aiResponse =
            '👥 来宾名册在这里！看看都有谁来～\n说不定能碰到老朋友呢！婚礼就是个大party！🎪'
          setActiveModal('guests')
          break

        case 'view_invitation':
          aiResponse =
            '💌 邀请函来啦！\n包含婚礼时间、地点、导航和联系方式～\n可以保存或分享给朋友哦！\n点击查看完整邀请函！🎊'
          setActiveModal('invitation')
          break

        default:
          aiResponse = '🤔 这个功能正在完善中，敬请期待哦！'
      }

      setChatMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content: aiResponse,
          timestamp: new Date(),
        },
      ])
      setIsAITyping(false)
    }, 600)
  }

  const handleSend = () => {
    if (!message.trim()) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    }

    setChatMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsAITyping(true)

    // 模拟AI思考延迟
    setTimeout(() => {
      const aiReply = getSmartReply(message)
      const aiMessage: ChatMessage = {
        role: 'ai',
        content: aiReply,
        timestamp: new Date(),
      }

      setChatMessages(prev => [...prev, aiMessage])
      setIsAITyping(false)
    }, 500)
  }

  const handleShortcutClick = (command: string) => {
    const shortcut = chatTemplates.shortcuts.find(s => s.command === command)
    if (shortcut) {
      setChatMessages(prev => [
        ...prev,
        {
          role: 'user',
          content: `${shortcut.emoji} ${shortcut.label}`,
          timestamp: new Date(),
        },
      ])
      handleAction(command)
    }
  }

  return (
    <>
      {/* 触发按钮 - 左上角，带微振动动效 */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{
          scale: 1.1,
          transition: { duration: 0.15 },
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-20 right-4 z-[100] w-14 h-14 md:w-16 md:h-16 rounded-full
          bg-gold/90 backdrop-blur-sm
          flex items-center justify-center
          shadow-2xl shadow-gold/50
          hover:bg-gold hover:scale-110
          transition-all duration-300
          ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
        aria-label="打开YYC³ AI助手"
      >
        <img 
          src="/yyc3-logo-black.png" 
          alt="YYC³" 
          className="w-8 h-8 md:w-10 md:h-10 object-contain"
        />
        {/* 脉冲动画环 */}
        <span className="absolute inset-0 rounded-full bg-gold/40 animate-ping" />
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
              className="fixed inset-0 z-[90] bg-graphite/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none md:pointer-events-none"
              onClick={() => setIsOpen(false)}
            />

            {/* 面板 - 增强动画 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.8, y: -20, filter: 'blur(10px)' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              drag
              dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
              dragElastic={0.1}
              dragControls={dragControls}
              dragMomentum={false}
              className="fixed top-20 left-4 md:top-4 md:left-auto md:right-4 z-[100] w-[calc(100vw-2rem)] max-w-sm bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border overflow-hidden"
              style={{ touchAction: 'none' }}
            >
              {/* 头部 - 拖拽手柄 */}
              <div
                className="flex items-center justify-between p-4 bg-gold/10 border-b border-border cursor-grab active:cursor-grabbing"
                onPointerDown={e => dragControls.start(e)}
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
                    className="w-8 h-8 min-w-[44px] min-h-[44px] rounded-full hover:bg-muted flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                    aria-label="关闭AI助手"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 快捷操作 */}
              <div className="p-4 border-b border-border">
                <p className="text-xs text-muted-foreground mb-3">快捷操作</p>
                <div className="grid grid-cols-5 gap-2">
                  {quickActions.map(action => (
                    <motion.button
                      key={action.action}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShortcutClick(action.action)}
                      className="flex flex-col items-center gap-1 p-2 min-h-[44px] rounded-lg hover:bg-gold/10 transition-colors group focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                      aria-label={action.label}
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
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-gold text-graphite rounded-br-sm'
                          : 'bg-muted text-foreground rounded-bl-sm'
                      }`}
                    >
                      {msg.role === 'ai' && index === chatMessages.length - 1 ? (
                        <TypewriterMessage content={msg.content} />
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* AI正在输入... */}
                {isAITyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted px-3 py-2 rounded-xl rounded-bl-sm">
                      <div className="flex items-center gap-1">
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-gold rounded-full"
                        />
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-gold rounded-full"
                        />
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-gold rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* 输入区域 */}
              <div className="p-4 border-t border-border flex gap-2">
                <Input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="输入祝福或问题..."
                  className="flex-1"
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="bg-gold hover:bg-gold/90 text-graphite min-w-[44px] min-h-[44px] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  aria-label="发送消息"
                  disabled={!message.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 各种功能弹窗 */}
      <DraggableModal
        isOpen={activeModal === 'music'}
        onClose={() => setActiveModal(null)}
        title="婚礼音乐"
        icon={<Music className="w-5 h-5" />}
        width="max-w-md"
      >
        <MusicModalContent />
      </DraggableModal>

      <DraggableModal
        isOpen={activeModal === 'rsvp'}
        onClose={() => setActiveModal(null)}
        title="来宾签到"
        icon={<Calendar className="w-5 h-5" />}
        width="max-w-md"
      >
        <RSVPModalContent />
      </DraggableModal>

      <DraggableModal
        isOpen={activeModal === 'guests'}
        onClose={() => setActiveModal(null)}
        title="来宾名册"
        icon={<Users className="w-5 h-5" />}
        width="max-w-lg"
      >
        <GuestListModalContent />
      </DraggableModal>

      <DraggableModal
        isOpen={activeModal === 'contact'}
        onClose={() => setActiveModal(null)}
        title="联系我们"
        icon={<Phone className="w-5 h-5" />}
        width="max-w-md"
      >
        <ContactModalContent />
      </DraggableModal>

      {activeModal === 'invitation' && (
        <DraggableModal
          isOpen={activeModal === 'invitation'}
          onClose={() => setActiveModal(null)}
          title="婚礼邀请函"
          icon={<Sparkles className="w-5 h-5 text-gold" />}
          width="max-w-3xl"
        >
          <div className="p-4">
            <InvitationCard onClose={() => setActiveModal(null)} />
          </div>
        </DraggableModal>
      )}
    </>
  )
}
