"use client"

// 移除不存在的NavLink导入，使用普通的a标签替代
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

interface NavbarProps {
  currentPage: string
}

interface NavItem {
  id: string
  title: string
  emoji: string
  path: string
}

export default function Navbar({ currentPage }: NavbarProps) {
  const navItems: NavItem[] = [
    { id: "home", title: "首页", emoji: "💒", path: "/home" },
    { id: "about", title: "关于我们", emoji: "💕", path: "/about" },
    { id: "schedule", title: "婚礼日程", emoji: "📅", path: "/schedule" },
    { id: "gallery", title: "照片画廊", emoji: "📸", path: "/gallery" },
    { id: "videos", title: "婚礼视频", emoji: "🎬", path: "/videos" },
    { id: "entertainment", title: "娱乐休闲", emoji: "🎮", path: "/entertainment" },
    { id: "chat", title: "聊天室", emoji: "💬", path: "/chat" },
    { id: "interaction", title: "互动留言", emoji: "✍️", path: "/interaction" },
  ]

  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const currentIndex = navItems.findIndex(item => item.id === currentPage)
  const totalPages = navItems.length

  const goToPreviousPage = () => {
    if (currentIndex > 0) {
      window.location.href = navItems[currentIndex - 1].path
    }
  }

  const goToNextPage = () => {
    if (currentIndex < totalPages - 1) {
      window.location.href = navItems[currentIndex + 1].path
    }
  }

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        goToPreviousPage()
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        goToNextPage()
      } else if (e.key >= "1" && e.key <= "9") {
        const pageIndex = parseInt(e.key) - 1
        if (pageIndex < totalPages) {
          window.location.href = navItems[pageIndex].path
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, totalPages, navItems])

  return (
    <>
      {/* 顶部导航栏 - 固定位置 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gold">💒 婚礼</span>
          </div>
          
          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.path}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full transition-all text-muted-foreground hover:text-foreground hover:bg-card"
              >
                <span>{item.emoji}</span>
                <span>{item.title}</span>
              </a>
            ))}
          </nav>
          
          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-card"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="菜单"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>
      
      {/* 移动端菜单 */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg pt-20">
          <nav className="flex flex-col items-center gap-4 px-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.path}
                className="flex items-center gap-2 px-6 py-3 rounded-lg w-full justify-center transition-all text-muted-foreground hover:text-foreground hover:bg-card"
                onClick={() => setShowMobileMenu(false)}
              >
                <span className="text-xl">{item.emoji}</span>
                <span className="text-lg">{item.title}</span>
              </a>
            ))}
          </nav>
          
          <button
            className="absolute top-6 right-6 p-2 rounded-full bg-card"
            onClick={() => setShowMobileMenu(false)}
            aria-label="关闭菜单"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
      
      {/* 底部导航按钮 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentIndex === 0}
          className={`w-12 h-12 rounded-full bg-card/80 backdrop-blur-xl border border-border flex items-center justify-center transition-all ${ 
            currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-gold hover:border-gold hover:text-graphite" 
          }`}
          aria-label="上一页"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="bg-card/80 backdrop-blur-xl px-4 py-2 rounded-full border border-border">
          <span className="text-sm font-medium">
            {currentIndex + 1} / {totalPages}
          </span>
        </div>
        
        <button
          onClick={goToNextPage}
          disabled={currentIndex === totalPages - 1}
          className={`w-12 h-12 rounded-full bg-card/80 backdrop-blur-xl border border-border flex items-center justify-center transition-all ${ 
            currentIndex === totalPages - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-gold hover:border-gold hover:text-graphite" 
          }`}
          aria-label="下一页"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </>
  )
}
