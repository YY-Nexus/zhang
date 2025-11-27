"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Heart, ChevronLeft, ChevronRight } from "@/components/icons"
import { getRandomCopy, type WelcomeCopy } from "@/lib/wedding-copywriting"

const weddingPhotos = [
  { id: 1, src: "/Wedding Photos/Wedding Document Photo.jpg", title: "证件合照", desc: "我们的故事开始" },
  { id: 2, src: "/Wedding Photos/Groom", title: "新郎 · 张波", desc: "期待与你共度余生" },
  { id: 3, src: "/Wedding Photos/Bride", title: "新娘 · 邓芮", desc: "最美的遇见" },
  { id: 4, src: "/Wedding Photos/Son", title: "爱的结晶", desc: "家的温暖" },
]

function PhotoFrame({
  photo,
  index,
  activeIndex,
  totalPhotos,
  onClick,
}: {
  photo: (typeof weddingPhotos)[0]
  index: number
  activeIndex: number
  totalPhotos: number
  onClick: () => void
}) {
  // 计算相对于当前活动照片的位置
  const relativeIndex = index - activeIndex
  const isActive = index === activeIndex

  // 3D 旋转和位置计算
  const rotateY = relativeIndex * 25
  const translateX = relativeIndex * 120
  const translateZ = Math.abs(relativeIndex) * -100
  const scale = isActive ? 1 : 0.8 - Math.abs(relativeIndex) * 0.1
  const opacity = Math.max(0.3, 1 - Math.abs(relativeIndex) * 0.3)
  const zIndex = totalPhotos - Math.abs(relativeIndex)

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 cursor-pointer"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
        zIndex,
      }}
      animate={{
        x: `calc(-50% + ${translateX}px)`,
        y: "-50%",
        z: translateZ,
        rotateY,
        scale,
        opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
      }}
      onClick={onClick}
      whileHover={isActive ? { scale: 1.05 } : undefined}
    >
      <div className="relative w-48 h-64 md:w-56 md:h-72 lg:w-64 lg:h-80 overflow-hidden rounded-xl shadow-2xl">
        {/* 相框边框效果 */}
        <div
          className={`absolute inset-0 rounded-xl border-4 ${isActive ? "border-gold" : "border-graphite/50"} z-10 pointer-events-none transition-colors duration-300`}
        />

        {/* 相框内部光泽效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent z-20 pointer-events-none" />

        {/* 照片 */}
        <Image
          src={photo.src || "/placeholder.svg"}
          alt={photo.title}
          width={256}
          height={320}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src = `/placeholder.svg?height=320&width=256&query=${encodeURIComponent(photo.title)}`;
          }}
        />

        {/* 底部信息渐变 */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-graphite/90 via-graphite/50 to-transparent transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-70"}`}
        >
          <h3 className="text-cream font-semibold text-sm md:text-base truncate">{photo.title}</h3>
          <p className="text-cream/70 text-xs truncate">{photo.desc}</p>
        </div>

        {/* 活动状态光晕 */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ boxShadow: "0 0 0 0 rgba(212, 175, 55, 0)" }}
            animate={{ boxShadow: "0 0 30px 5px rgba(212, 175, 55, 0.3)" }}
            transition={{ duration: 0.5 }}
          />
        )}
      </div>
    </motion.div>
  )
}

// 桌面端 3D 画廊
function DesktopGallery({
  onPhotoClick,
  activeIndex,
  setActiveIndex,
}: {
  onPhotoClick: (photo: (typeof weddingPhotos)[0]) => void
  activeIndex: number
  setActiveIndex: (index: number) => void
}) {
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: "1200px" }}>
      <div className="relative w-full h-96" style={{ transformStyle: "preserve-3d" }}>
        {weddingPhotos.map((photo, index) => (
          <PhotoFrame
            key={photo.id}
            photo={photo}
            index={index}
            activeIndex={activeIndex}
            totalPhotos={weddingPhotos.length}
            onClick={() => {
              if (index === activeIndex) {
                onPhotoClick(photo)
              } else {
                setActiveIndex(index)
              }
            }}
          />
        ))}
      </div>

      {/* 导航按钮 */}
      <button
        onClick={() => setActiveIndex((activeIndex - 1 + weddingPhotos.length) % weddingPhotos.length)}
        className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center text-gold hover:bg-gold/40 transition-colors z-30"
        aria-label="上一张"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => setActiveIndex((activeIndex + 1) % weddingPhotos.length)}
        className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center text-gold hover:bg-gold/40 transition-colors z-30"
        aria-label="下一张"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* 指示器 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {weddingPhotos.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? "bg-gold w-8" : "bg-gold/30 w-2 hover:bg-gold/50"
            }`}
            aria-label={`查看第${index + 1}张照片`}
          />
        ))}
      </div>
    </div>
  )
}

// 移动端滑动画廊
function MobileGallery({
  onPhotoClick,
  activeIndex,
  setActiveIndex,
}: {
  onPhotoClick: (photo: (typeof weddingPhotos)[0]) => void
  activeIndex: number
  setActiveIndex: (index: number) => void
}) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[280px] h-[380px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 cursor-pointer"
            onClick={() => onPhotoClick(weddingPhotos[activeIndex])}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden border-4 border-gold shadow-2xl">
              <Image
                src={weddingPhotos[activeIndex].src || "/placeholder.svg"}
                alt={weddingPhotos[activeIndex].title}
                width={280}
                height={380}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = `/placeholder.svg?height=380&width=280&query=${encodeURIComponent(weddingPhotos[activeIndex].title)}`;
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-graphite/90 to-transparent p-4">
                <h3 className="text-cream font-semibold text-lg">{weddingPhotos[activeIndex].title}</h3>
                <p className="text-cream/70 text-sm">{weddingPhotos[activeIndex].desc}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
          {weddingPhotos.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? "bg-gold w-6" : "bg-gold/30"
              }`}
              aria-label={`查看第${index + 1}张照片`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => setActiveIndex((activeIndex - 1 + weddingPhotos.length) % weddingPhotos.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gold/20 backdrop-blur flex items-center justify-center text-gold"
        aria-label="上一张"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setActiveIndex((activeIndex + 1) % weddingPhotos.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gold/20 backdrop-blur flex items-center justify-center text-gold"
        aria-label="下一张"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof weddingPhotos)[0] | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [welcomeCopy, setWelcomeCopy] = useState<WelcomeCopy | null>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    setWelcomeCopy(getRandomCopy())
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handlePhotoClick = (photo: (typeof weddingPhotos)[0]) => {
    setSelectedPhoto(photo)
  }

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % weddingPhotos.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-graphite via-graphite/95 to-graphite/90">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

        {/* 动态光效 */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* 顶部Logo区域 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 md:px-12"
      >
        <div className="flex items-center gap-2 ml-14 md:ml-16">
          <span className="text-3xl">囍</span>
          <div className="hidden md:block">
            <h1 className="text-gold font-semibold text-lg tracking-wider">张波 & 邓芮</h1>
            <p className="text-cream/60 text-xs">Zhang Bo & Deng Rui</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-cream/80 text-sm">
          <a href="#about" className="hover:text-gold transition-colors">
            关于我们
          </a>
          <a href="#schedule" className="hover:text-gold transition-colors">
            婚礼日程
          </a>
          <a href="#gallery" className="hover:text-gold transition-colors">
            精彩瞬间
          </a>
          <a href="#rsvp" className="hover:text-gold transition-colors">
            出席确认
          </a>
        </nav>
      </motion.header>

      {/* 主标题 */}
      <div className="absolute top-24 md:top-32 left-1/2 -translate-x-1/2 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <p className="text-gold/80 text-sm md:text-base tracking-widest mb-2">WE ARE GETTING MARRIED</p>
          <h2 className="text-cream text-4xl md:text-6xl font-bold tracking-wide mb-4">
            <span className="text-gold">张波</span>
            <span className="mx-4 text-gold/60">&</span>
            <span className="text-gold">邓芮</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-cream/60 text-sm">
            <Heart className="w-4 h-4 text-gold fill-gold" />
            <span>2025.11.29 农历十月初十</span>
            <Heart className="w-4 h-4 text-gold fill-gold" />
          </div>

          {welcomeCopy && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-6 max-w-md mx-auto px-4"
            >
              <p className="text-cream/70 text-sm leading-relaxed">{welcomeCopy.lines[0]}</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* 画廊区域 */}
      <div className="absolute inset-0 pt-48 md:pt-56">
        {isMobile ? (
          <MobileGallery onPhotoClick={handlePhotoClick} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        ) : (
          <DesktopGallery onPhotoClick={handlePhotoClick} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        )}
      </div>

      {welcomeCopy && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 max-w-sm mx-auto px-4"
        >
          <div className="bg-gold/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
            <p className="text-cream/60 text-xs">{welcomeCopy.customTip}</p>
          </div>
        </motion.div>
      )}

      {/* 底部提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/50"
      >
        <span className="text-xs tracking-widest">向下滚动探索更多</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.div>

      {/* 照片详情弹窗 */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/80 backdrop-blur-xl"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-lg w-full mx-4 bg-card rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedPhoto.src || "/placeholder.svg"}
                alt={selectedPhoto.title}
                width={480}
                height={320}
                className="w-full h-80 object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = `/placeholder.svg?height=320&width=480&query=${encodeURIComponent(selectedPhoto.title)}`;
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{selectedPhoto.title}</h3>
                <p className="text-muted-foreground">{selectedPhoto.desc}</p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-graphite/50 text-cream flex items-center justify-center hover:bg-graphite transition-colors"
                aria-label="关闭"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
