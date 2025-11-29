"use client"

import { motion } from "framer-motion"
import { Phone, Navigation, Share2, Download, Heart, Calendar, MapPin, Clock } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import { openNavigation, makeCall } from "@/lib/navigation-utils"
import { useState } from "react"
import Image from "next/image"

// 婚礼信息
const weddingInfo = {
  groom: "张波",
  bride: "邓芮",
  date: "2025年11月29日",
  dateLunar: "农历十月初十 星期六",
  time: "上午 11:30",
  venue: "富豪大酒店(阿新大道店)",
  address: "河南省洛阳市孟津区将军路57号",
  groomPhone: "18736396660",
  bridePhone: "19103895555",
}

const WEBSITE_URL = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'https://zhang.0379.love'

interface InvitationCardProps {
  onClose?: () => void
}

export default function InvitationCard({ onClose }: InvitationCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(WEBSITE_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  const handleDownload = () => {
    const element = document.getElementById('invitation-card')
    if (!element) return

    // 使用html2canvas或直接打印
    window.print()
  }

  return (
    <motion.div
      id="invitation-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto bg-gradient-to-br from-cream via-cream/95 to-gold/10 rounded-3xl shadow-2xl overflow-hidden border-4 border-gold/30"
    >
      {/* 装饰背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 text-9xl text-gold/10 font-bold select-none">囍</div>
        <div className="absolute bottom-10 left-10 text-9xl text-gold/10 font-bold select-none rotate-180">囍</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] text-gold/5 font-bold select-none">❤️</div>
      </div>

      <div className="relative p-8 md:p-12">
        {/* 顶部装饰 */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl mb-4">💒</motion.div>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-graphite mb-2"
          >
            结婚请柬
          </motion.h1>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="w-24 h-1 bg-gold mx-auto rounded-full"
          />
        </div>

        {/* 新人姓名 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-3xl md:text-4xl font-bold text-graphite">
              {weddingInfo.groom}
            </div>
            <Heart className="w-8 h-8 md:w-10 md:h-10 text-gold fill-gold" />
            <div className="text-3xl md:text-4xl font-bold text-graphite">
              {weddingInfo.bride}
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            诚挚邀请您参加我们的婚礼
          </p>
        </motion.div>

        {/* 婚礼信息卡片 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-8 border-2 border-gold/20 shadow-lg"
        >
          <div className="space-y-4">
            {/* 日期 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-gold" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">婚礼日期</p>
                <p className="text-lg font-semibold text-graphite">{weddingInfo.date}</p>
                <p className="text-sm text-muted-foreground">{weddingInfo.dateLunar}</p>
              </div>
            </div>

            {/* 时间 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-gold" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">婚礼时间</p>
                <p className="text-lg font-semibold text-graphite">{weddingInfo.time}</p>
              </div>
            </div>

            {/* 地点 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-gold" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">婚礼地点</p>
                <p className="text-lg font-semibold text-graphite mb-1">{weddingInfo.venue}</p>
                <p className="text-sm text-muted-foreground">{weddingInfo.address}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 一键操作按钮 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-3 mb-8"
        >
          {/* 一键导航 */}
          <Button
            onClick={() => openNavigation()}
            className="w-full min-h-[56px] bg-gold hover:bg-gold-dark text-graphite font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            <Navigation className="w-5 h-5 mr-3" />
            一键导航到婚礼地点
          </Button>

          {/* 一键电话 */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => makeCall(weddingInfo.groomPhone)}
              variant="outline"
              className="min-h-[56px] border-gold/50 hover:bg-gold/10 hover:border-gold text-graphite font-semibold rounded-xl"
              size="lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              呼叫新郎
            </Button>
            <Button
              onClick={() => makeCall(weddingInfo.bridePhone)}
              variant="outline"
              className="min-h-[56px] border-gold/50 hover:bg-gold/10 hover:border-gold text-graphite font-semibold rounded-xl"
              size="lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              呼叫新娘
            </Button>
          </div>
        </motion.div>

        {/* 二维码和分享 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-gold/20"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* 二维码 */}
            <div className="flex-shrink-0">
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <QRCodeSVG
                  value={WEBSITE_URL}
                  size={120}
                  bgColor="#ffffff"
                  fgColor="#2D3436"
                  level="H"
                  includeMargin
                />
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                扫描访问网站
              </p>
            </div>

            {/* 链接和分享 */}
            <div className="flex-1 w-full md:w-auto">
              <p className="text-sm text-muted-foreground mb-2">网站链接</p>
              <div className="flex items-center gap-2 mb-4">
                <p className="flex-1 text-sm font-mono text-graphite break-all bg-white/80 p-2 rounded-lg">
                  {WEBSITE_URL}
                </p>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="min-w-[44px] min-h-[44px] shrink-0"
                >
                  {copied ? (
                    <span className="text-green-500">✓</span>
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex-1 min-h-[44px]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  保存请柬
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="flex-1 min-h-[44px]"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  分享链接
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 底部祝福语 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-8"
        >
          <p className="text-gold text-lg font-semibold mb-2">
            期待您的到来
          </p>
          <p className="text-muted-foreground text-sm">
            您的祝福是我们最大的幸福 💕
          </p>
        </motion.div>

        {/* 关闭按钮（如果有） */}
        {onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            className="absolute top-4 right-4"
            size="icon"
          >
            <span className="text-2xl">×</span>
          </Button>
        )}
      </div>
    </motion.div>
  )
}

