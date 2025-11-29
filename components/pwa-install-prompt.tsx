'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download } from './icons'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // 检测是否为 iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(ios)

    // 检测是否已安装（standalone 模式）
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://')
    setIsStandalone(standalone)

    // 如果已经是 standalone 模式，不显示提示
    if (standalone) return

    // 检查是否已经提示过（24小时内不再提示）
    const lastPromptTime = localStorage.getItem('pwa-install-prompt-time')
    if (lastPromptTime) {
      const hoursSinceLastPrompt = (Date.now() - parseInt(lastPromptTime)) / (1000 * 60 * 60)
      if (hoursSinceLastPrompt < 24) return
    }

    // Android/Desktop: 监听 beforeinstallprompt 事件
    const handler = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)

      // 延迟显示提示（等待页面加载完成）
      setTimeout(() => {
        setShowPrompt(true)
      }, 5000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // iOS: 延迟显示手动安装提示
    if (ios && !standalone) {
      setTimeout(() => {
        setShowPrompt(true)
      }, 8000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // 显示安装提示
    deferredPrompt.prompt()

    // 等待用户响应
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('用户接受了安装')
    } else {
      console.log('用户拒绝了安装')
    }

    // 清除 prompt
    setDeferredPrompt(null)
    setShowPrompt(false)

    // 记录提示时间
    localStorage.setItem('pwa-install-prompt-time', Date.now().toString())
  }

  const handleClose = () => {
    setShowPrompt(false)
    // 记录提示时间
    localStorage.setItem('pwa-install-prompt-time', Date.now().toString())
  }

  // 不显示提示的情况
  if (!showPrompt || isStandalone) return null

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-200 bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border overflow-hidden"
        >
          {/* 关闭按钮 */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="关闭"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* 内容 */}
          <div className="p-6">
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="w-16 h-16 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                <img src="/yyc3-logo-blue.png" alt="YYC³" className="w-12 h-12 object-contain" />
              </div>

              {/* 文字 */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-1">📱 安装到主屏幕</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  将婚礼邀请函添加到主屏幕，随时查看婚礼信息
                </p>

                {/* iOS 安装说明 */}
                {isIOS && (
                  <div className="bg-muted/50 rounded-lg p-3 mb-3 text-xs text-muted-foreground">
                    <p className="mb-2 font-medium text-foreground">📌 iOS 安装步骤：</p>
                    <ol className="space-y-1 list-decimal list-inside">
                      <li>
                        点击浏览器底部的"分享"按钮 <span className="inline-block">📤</span>
                      </li>
                      <li>选择"添加到主屏幕"</li>
                      <li>点击"添加"确认</li>
                    </ol>
                  </div>
                )}

                {/* Android/Desktop 安装按钮 */}
                {deferredPrompt && (
                  <button
                    onClick={handleInstall}
                    className="w-full bg-gold hover:bg-gold/90 text-graphite font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    立即安装
                  </button>
                )}

                {/* iOS 手动安装提示 */}
                {isIOS && !deferredPrompt && (
                  <button
                    onClick={handleClose}
                    className="w-full bg-gold hover:bg-gold/90 text-graphite font-medium py-3 px-4 rounded-xl transition-colors"
                  >
                    我知道了
                  </button>
                )}
              </div>
            </div>

            {/* 特性列表 */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground text-center">
                <div>
                  <div className="text-lg mb-1">⚡</div>
                  <div>快速访问</div>
                </div>
                <div>
                  <div className="text-lg mb-1">📱</div>
                  <div>全屏体验</div>
                </div>
                <div>
                  <div className="text-lg mb-1">💾</div>
                  <div>离线可用</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
