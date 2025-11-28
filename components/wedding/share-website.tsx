"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { QRCodeSVG } from "qrcode.react"
import { QrCode, Copy, Check, Share2, Download, MessageCircle } from "@/components/icons"
import { Button } from "@/components/ui/button"
import DraggableModal from "./draggable-modal"

// 网站URL
const WEBSITE_URL = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'https://zhang.0379.love'

interface ShareWebsiteProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShareWebsite({ isOpen, onClose }: ShareWebsiteProps) {
  const [copied, setCopied] = useState(false)
  const [copiedQR, setCopiedQR] = useState(false)

  // 复制链接
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(WEBSITE_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  // 下载二维码
  const handleDownloadQR = () => {
    const element = document.getElementById('website-qr-code')
    if (!element || !(element instanceof SVGElement)) return

    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(element)
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `婚礼网站-${WEBSITE_URL.replace(/^https?:\/\//, '')}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setCopiedQR(true)
    setTimeout(() => setCopiedQR(false), 2000)
  }

  // 分享到微信（复制链接提示）
  const handleShareWeChat = async () => {
    await handleCopyLink()
    alert('链接已复制！\n\n请在微信中粘贴发送给好友，或长按二维码保存后发送。')
  }

  // 使用Web Share API（如果支持）
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '张波 & 邓芮 婚礼邀请',
          text: '诚挚邀请您参加我们的婚礼！',
          url: WEBSITE_URL,
        })
      } catch (error) {
        // 用户取消分享
        console.log('分享已取消')
      }
    } else {
      // 降级：复制链接
      await handleCopyLink()
    }
  }

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="分享婚礼网站"
      icon={<Share2 className="w-5 h-5 text-gold" />}
      width="max-w-md"
    >
      <div className="p-6 space-y-6">
        {/* 网站信息 */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            张波 & 邓芮 婚礼邀请
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            扫描二维码或复制链接分享给好友
          </p>
        </div>

        {/* 二维码 */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <QRCodeSVG
              id="website-qr-code"
              value={WEBSITE_URL}
              size={200}
              bgColor="#ffffff"
              fgColor="#2D3436"
              level="H"
              includeMargin
            />
          </div>
          
          {/* 下载二维码按钮 */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadQR}
            className="min-h-[44px]"
          >
            {copiedQR ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-500" />
                已保存
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                保存二维码
              </>
            )}
          </Button>
        </div>

        {/* 网站链接 */}
        <div className="space-y-3">
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-2">网站链接</p>
            <div className="flex items-center gap-2">
              <p className="flex-1 text-sm font-mono text-foreground break-all">
                {WEBSITE_URL}
              </p>
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopyLink}
                className="min-w-[44px] min-h-[44px] shrink-0"
                aria-label="复制链接"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* 分享按钮组 */}
          <div className="grid grid-cols-2 gap-3">
            {/* 微信分享 */}
            <Button
              variant="outline"
              onClick={handleShareWeChat}
              className="min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
              微信分享
            </Button>

            {/* 系统分享 */}
            <Button
              variant="outline"
              onClick={handleNativeShare}
              className="min-h-[44px]"
            >
              <Share2 className="w-4 h-4 mr-2" />
              更多分享
            </Button>
          </div>
        </div>

        {/* 使用提示 */}
        <div className="bg-gold/10 rounded-lg p-4 border border-gold/20">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-gold">分享方式：</strong>
            <br />
            1. 保存二维码图片，发送给好友
            <br />
            2. 复制链接，通过微信/短信发送
            <br />
            3. 直接分享到微信/其他应用
          </p>
        </div>
      </div>
    </DraggableModal>
  )
}

