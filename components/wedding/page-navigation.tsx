"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Circle } from "lucide-react"
import { useState, useEffect } from "react"
import TopNavigation from "./top-navigation"

export interface PageConfig {
  id: string
  title: string
  emoji: string
  component: React.ReactNode
  bgGradient: string
}

interface PageNavigationProps {
  pages: PageConfig[]
  initialPage?: number
}

export default function PageNavigation({ pages, initialPage = 0 }: PageNavigationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [direction, setDirection] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return

      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        goToPreviousPage()
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        goToNextPage()
      } else if (e.key >= "1" && e.key <= "9") {
        const pageIndex = parseInt(e.key) - 1
        if (pageIndex < pages.length) {
          goToPage(pageIndex)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentPage, isTransitioning, pages.length])

  // 鼠标滚轮导航
  useEffect(() => {
    let lastScrollTime = 0
    const scrollThreshold = 1000 // 1秒内不重复触发

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now()
      if (now - lastScrollTime < scrollThreshold || isTransitioning) return

      if (Math.abs(e.deltaY) > 10) {
        lastScrollTime = now
        if (e.deltaY > 0) {
          goToNextPage()
        } else {
          goToPreviousPage()
        }
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: true })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [currentPage, isTransitioning])

  const goToPage = (index: number) => {
    if (index === currentPage || isTransitioning) return
    setDirection(index > currentPage ? 1 : -1)
    setCurrentPage(index)
    setIsTransitioning(true)
    setTimeout(() => setIsTransitioning(false), 800)
  }

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      goToPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1)
    }
  }

  const slideVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      y: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.95,
    }),
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 顶部导航栏 */}
      <TopNavigation 
        pages={pages.map(p => ({ id: p.id, title: p.title, emoji: p.emoji }))}
        currentPage={currentPage}
        onNavigate={goToPage}
      />

      {/* 页面内容区域 */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentPage}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          }}
          className={`absolute inset-0 w-full h-full ${pages[currentPage].bgGradient}`}
        >
          {pages[currentPage].component}
        </motion.div>
      </AnimatePresence>

      {/* 侧边导航栏 - 右侧 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3"
      >
        {pages.map((page, index) => (
          <motion.button
            key={page.id}
            onClick={() => goToPage(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`group relative flex items-center justify-center transition-all min-w-[44px] min-h-[44px] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-full ${
              currentPage === index ? "scale-125" : ""
            }`}
            aria-label={`前往${page.title}`}
            aria-current={currentPage === index ? "page" : undefined}
            disabled={isTransitioning}
          >
            {/* 圆点指示器 */}
            <div
              className={`w-3 h-3 rounded-full border-2 transition-all ${
                currentPage === index
                  ? "bg-gold border-gold scale-125"
                  : "bg-transparent border-gold/50 hover:border-gold"
              }`}
            />

            {/* 悬浮提示 */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-3 whitespace-nowrap bg-card/95 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-border shadow-lg pointer-events-none"
            >
              <span className="text-sm font-medium">
                {page.emoji} {page.title}
              </span>
            </motion.div>
          </motion.button>
        ))}
      </motion.div>

      {/* 底部导航按钮 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
        <motion.button
          onClick={goToPreviousPage}
          disabled={currentPage === 0 || isTransitioning}
          whileHover={{ scale: currentPage === 0 ? 1 : 1.1 }}
          whileTap={{ scale: currentPage === 0 ? 1 : 0.9 }}
          className={`w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-card/80 backdrop-blur-xl border border-border flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
            currentPage === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-gold hover:border-gold hover:text-graphite"
          }`}
          aria-label="上一页"
          aria-disabled={currentPage === 0 || isTransitioning}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <div className="bg-card/80 backdrop-blur-xl px-4 py-2 rounded-full border border-border">
          <span className="text-sm font-medium">
            {currentPage + 1} / {pages.length}
          </span>
        </div>

        <motion.button
          onClick={goToNextPage}
          disabled={currentPage === pages.length - 1 || isTransitioning}
          whileHover={{ scale: currentPage === pages.length - 1 ? 1 : 1.1 }}
          whileTap={{ scale: currentPage === pages.length - 1 ? 1 : 0.9 }}
          className={`w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-card/80 backdrop-blur-xl border border-border flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
            currentPage === pages.length - 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-gold hover:border-gold hover:text-graphite"
          }`}
          aria-label="下一页"
          aria-disabled={currentPage === pages.length - 1 || isTransitioning}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* 滚动提示 - 仅在第一页显示 */}
      {currentPage === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
        >
          <span className="text-sm text-muted-foreground">向下滚动探索更多</span>
          <ChevronRight className="w-4 h-4 rotate-90 text-gold" />
        </motion.div>
      )}
    </div>
  )
}

