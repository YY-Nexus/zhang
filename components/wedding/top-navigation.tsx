"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Heart, Phone, Menu, X, Share2 } from "@/components/icons"
import ShareWebsite from "./share-website"

interface TopNavigationProps {
  pages: Array<{
    id: string
    title: string
    emoji: string
  }>
  currentPage: number
  onNavigate: (index: number) => void
}

export default function TopNavigation({ pages, currentPage, onNavigate }: TopNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)

  // 监听滚动，添加背景（仅在非分页导航模式下有效）
  useEffect(() => {
    // 检查是否在分页导航模式下（通过检查是否有固定高度的容器）
    const isPaginatedMode = document.querySelector('.h-screen.overflow-hidden')
    if (isPaginatedMode) {
      // 分页模式下，始终显示背景
      setIsScrolled(true)
      return
    }
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 关闭菜单
  const handleNavigate = (index: number) => {
    onNavigate(index)
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* 顶部导航栏 */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMenuOpen
            ? "bg-graphite/95 backdrop-blur-xl border-b border-border shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo 和标题 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleNavigate(0)}
              role="button"
              tabIndex={0}
              aria-label="返回首页"
            >
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-linear-to-br from-gold to-purple-500 flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-graphite fill-graphite" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
                  张波 <span className="text-gold">❤️</span> 邓芮
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground">2025.11.29 永结同心</p>
              </div>
            </motion.div>

            {/* 桌面端导航菜单 */}
            <div className="hidden lg:flex items-center gap-1">
              {pages.map((page, index) => (
                <motion.button
                  key={page.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigate(index)}
                  className={`px-4 py-2 min-h-[44px] rounded-lg text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
                    currentPage === index
                      ? "bg-gold text-graphite shadow-lg"
                      : "bg-gold/20 text-gold hover:bg-gold/30"
                  }`}
                  aria-label={`前往${page.title}`}
                  aria-current={currentPage === index ? "page" : undefined}
                >
                  <span className="mr-2">{page.emoji}</span>
                  {page.title}
                </motion.button>
              ))}
            </div>

            {/* 分享和联系按钮（桌面端） */}
            <div className="hidden lg:flex items-center gap-2">
              <motion.button
                onClick={() => setIsShareOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gold/20 text-gold rounded-lg font-medium hover:bg-gold/30 transition-colors shadow-lg min-h-[44px] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                aria-label="分享网站"
              >
                <Share2 className="w-4 h-4" />
                分享
              </motion.button>
              <motion.button
                onClick={() => {
                  const { makeCall } = require('@/lib/navigation-utils')
                  makeCall('18736396660')
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-graphite rounded-lg font-medium hover:bg-gold/90 transition-colors shadow-lg min-h-[44px] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                aria-label="联系新人"
              >
                <Phone className="w-4 h-4" />
                联系新人
              </motion.button>
            </div>

            {/* 移动端菜单按钮 */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-card/80 backdrop-blur-sm border border-border hover:border-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* 移动端下拉菜单 */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* 菜单内容 */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-16 md:top-20 left-4 right-4 z-50 lg:hidden"
            >
              <div className="bg-card/95 backdrop-blur-xl rounded-2xl border border-border shadow-2xl overflow-hidden">
                <div className="p-4 space-y-2">
                  {pages.map((page, index) => (
                    <motion.button
                      key={page.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigate(index)}
                      className={`w-full text-left px-4 py-3 min-h-[44px] rounded-xl text-base font-medium transition-all focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
                        currentPage === index
                          ? "bg-gold text-graphite shadow-md"
                          : "text-foreground hover:bg-gold/10 hover:text-gold"
                      }`}
                      aria-label={`前往${page.title}`}
                      aria-current={currentPage === index ? "page" : undefined}
                    >
                      <span className="mr-3 text-xl">{page.emoji}</span>
                      {page.title}
                    </motion.button>
                  ))}
                </div>

                {/* 移动端操作按钮 */}
                <div className="p-4 border-t border-border space-y-2">
                  <motion.button
                    onClick={() => {
                      setIsShareOpen(true)
                      setIsMenuOpen(false)
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-gold/20 text-gold rounded-xl font-medium hover:bg-gold/30 transition-colors focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                    aria-label="分享网站"
                  >
                    <Share2 className="w-4 h-4" />
                    分享网站
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      const { makeCall } = require('@/lib/navigation-utils')
                      makeCall('18736396660')
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-gold text-graphite rounded-xl font-medium hover:bg-gold/90 transition-colors focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                    aria-label="联系新人"
                  >
                    <Phone className="w-4 h-4" />
                    联系新人
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* 防止页面内容与导航栏重叠的占位元素 */}
      <div className="h-16 md:h-20" />
      
      {/* 分享网站弹窗 */}
      <ShareWebsite isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  )
}

