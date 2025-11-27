"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Heart, Phone } from "@/components/icons"
import Image from "next/image"

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

  // 监听滚动，添加背景
  useEffect(() => {
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
            >
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-gold to-purple-500 flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 md:w-7 md:h-7 text-white" />
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === index
                      ? "bg-gold text-graphite shadow-lg"
                      : "text-foreground hover:bg-gold/10 hover:text-gold"
                  }`}
                >
                  <span className="mr-2">{page.emoji}</span>
                  {page.title}
                </motion.button>
              ))}
            </div>

            {/* 联系按钮（桌面端） */}
            <motion.a
              href="tel:13000000000"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gold text-graphite rounded-lg font-medium hover:bg-gold/90 transition-colors shadow-lg"
            >
              <Phone className="w-4 h-4" />
              联系新人
            </motion.a>

            {/* 移动端菜单按钮 */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-card/80 backdrop-blur-sm border border-border hover:border-gold transition-colors"
              aria-label="菜单"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
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
                      className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        currentPage === index
                          ? "bg-gold text-graphite shadow-md"
                          : "text-foreground hover:bg-gold/10 hover:text-gold"
                      }`}
                    >
                      <span className="mr-3 text-xl">{page.emoji}</span>
                      {page.title}
                    </motion.button>
                  ))}
                </div>

                {/* 移动端联系按钮 */}
                <div className="p-4 border-t border-border">
                  <motion.a
                    href="tel:13000000000"
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gold text-graphite rounded-xl font-medium hover:bg-gold/90 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    联系新人
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

