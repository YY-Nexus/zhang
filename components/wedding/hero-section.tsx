'use client'

import { ChevronDown, ChevronLeft, ChevronRight, Eye, Heart } from '@/components/icons'
import { getRandomCopy, type WelcomeCopy } from '@/lib/wedding-copywriting'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const weddingPhotos = [
  { id: 1, src: '/wedding/wedding-主婚合影.jpg', title: '执子之手 · 与子偕老', desc: '我们的幸福时刻' },
  { id: 2, src: '/wedding/Groom主婚单9.jpg', title: '新郎 · 张波', desc: '期待与你共度余生' },
  { id: 3, src: '/wedding/Bride-主纱1.jpg', title: '新娘 · 邓芮', desc: '最美的遇见' },
  { id: 4, src: '/wedding/son15.jpg', title: '爱的结晶', desc: '家的温暖' },
]

// 计算倒计时
function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date('2025-11-29T11:30:00').getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [])

  return timeLeft
}

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof weddingPhotos)[0] | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [welcomeCopy, setWelcomeCopy] = useState<WelcomeCopy | null>(null)
  const countdown = useCountdown()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    setWelcomeCopy(getRandomCopy())
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handlePhotoClick = (photo: (typeof weddingPhotos)[0]) => {
    setSelectedPhoto(photo)
  }

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % weddingPhotos.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-graphite via-graphite/98 to-graphite/95">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />

        {/* 动态光效 */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
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

      {/* 主内容区域 - 左右分屏 */}
      <div className="relative min-h-screen flex flex-col lg:flex-row items-center pt-20 pb-12 lg:pt-0 lg:pb-0">
        {/* 左侧：照片展示区 */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative w-full lg:w-1/2 h-[500px] md:h-[600px] lg:h-screen flex items-center justify-center px-4 lg:px-8 xl:px-12"
        >
          <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-2xl h-full flex items-center justify-center">
            {/* 照片轮播容器 */}
            <div className="relative w-full h-[90%] max-h-[600px] lg:max-h-[800px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
                  onClick={() => handlePhotoClick(weddingPhotos[activeIndex])}
                >
                  {/* 照片 */}
                  <Image
                    src={weddingPhotos[activeIndex].src || '/placeholder.svg'}
                    alt={weddingPhotos[activeIndex].title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onError={e => {
                      const target = e.currentTarget as HTMLImageElement
                      target.src = `/placeholder.svg?height=800&width=600&query=${encodeURIComponent(
                        weddingPhotos[activeIndex].title
                      )}`
                    }}
                  />

                  {/* 金色边框和光晕 */}
                  <div className="absolute inset-0 rounded-3xl border-[6px] border-gold shadow-[0_0_40px_rgba(212,175,55,0.4)] group-hover:shadow-[0_0_60px_rgba(212,175,55,0.6)] transition-shadow duration-300" />

                  {/* 底部信息 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-graphite/95 via-graphite/70 to-transparent p-6 md:p-8">
                    <h3 className="text-cream font-bold text-xl md:text-2xl lg:text-3xl mb-2">
                      {weddingPhotos[activeIndex].title}
                    </h3>
                    <p className="text-cream/80 text-sm md:text-base lg:text-lg">
                      {weddingPhotos[activeIndex].desc}
                    </p>
                  </div>

                  {/* 悬停提示 */}
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-colors duration-300 rounded-3xl flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-gold/20 backdrop-blur-sm rounded-full p-4 border-2 border-gold/50">
                        <Eye className="w-8 h-8 text-gold" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* 导航按钮 */}
              <button
                onClick={e => {
                  e.stopPropagation()
                  setActiveIndex((activeIndex - 1 + weddingPhotos.length) % weddingPhotos.length)
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gold/30 backdrop-blur-md flex items-center justify-center text-gold hover:bg-gold/50 hover:scale-110 transition-all z-30 shadow-lg shadow-gold/20"
                aria-label="上一张"
              >
                <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
              </button>
              <button
                onClick={e => {
                  e.stopPropagation()
                  setActiveIndex((activeIndex + 1) % weddingPhotos.length)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gold/30 backdrop-blur-md flex items-center justify-center text-gold hover:bg-gold/50 hover:scale-110 transition-all z-30 shadow-lg shadow-gold/20"
                aria-label="下一张"
              >
                <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
              </button>

              {/* 指示器 */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {weddingPhotos.map((_, index) => (
                  <button
                    key={index}
                    onClick={e => {
                      e.stopPropagation()
                      setActiveIndex(index)
                    }}
                    className={`h-2.5 md:h-3 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? 'bg-gold w-8 md:w-10 shadow-lg shadow-gold/50'
                        : 'bg-gold/30 w-2.5 md:w-3 hover:bg-gold/50 hover:w-4'
                    }`}
                    aria-label={`查看第${index + 1}张照片`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 右侧：文字和倒计时区 */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative w-full lg:w-1/2 flex flex-col items-center justify-center px-6 md:px-12 lg:px-16 xl:px-20 py-12 lg:py-0"
        >
          <div className="max-w-2xl w-full space-y-8 md:space-y-12">
            {/* 标题区域 */}
            <div className="text-center lg:text-left space-y-4 md:space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-gold/80 text-sm md:text-base lg:text-lg tracking-widest uppercase"
              >
                WE ARE GETTING MARRIED
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="text-cream text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-wide leading-tight"
              >
                <span className="text-gold">张波</span>
                <span className="mx-3 md:mx-4 text-gold/60 text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                  &
                </span>
                <span className="text-gold">邓芮</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="flex items-center justify-center lg:justify-start gap-2 md:gap-3 text-cream/70 text-sm md:text-base"
              >
                <Heart className="w-4 h-4 md:w-5 md:h-5 text-gold fill-gold" />
                <span>2025年11月29日</span>
                <span className="text-gold/60">·</span>
                <span>农历十月初十</span>
                <Heart className="w-4 h-4 md:w-5 md:h-5 text-gold fill-gold" />
              </motion.div>

              {welcomeCopy && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.8 }}
                  className="text-cream/70 text-base md:text-lg lg:text-xl leading-relaxed mt-6 md:mt-8"
                >
                  {welcomeCopy.lines[0]}
                </motion.p>
              )}
            </div>

            {/* 倒计时卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="bg-gold/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gold/20 shadow-xl"
            >
              <h3 className="text-gold text-center text-lg md:text-xl font-semibold mb-6">
                距离婚礼还有
              </h3>
              <div className="grid grid-cols-4 gap-3 md:gap-4">
                {[
                  { value: countdown.days, label: '天' },
                  { value: countdown.hours, label: '时' },
                  { value: countdown.minutes, label: '分' },
                  { value: countdown.seconds, label: '秒' },
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-graphite/50 rounded-xl p-4 md:p-5 mb-2">
                      <div className="text-gold text-2xl md:text-3xl lg:text-4xl font-bold">
                        {String(item.value).padStart(2, '0')}
                      </div>
                    </div>
                    <div className="text-cream/70 text-xs md:text-sm">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 欢迎语卡片 */}
            {welcomeCopy && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.8 }}
                className="bg-gold/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gold/20"
              >
                <p className="text-cream/60 text-sm md:text-base text-center leading-relaxed">
                  {welcomeCopy.customTip}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* 底部提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/50 z-10"
      >
        <span className="text-xs md:text-sm tracking-widest">向下滚动探索更多</span>
        <ChevronDown className="w-5 h-5 md:w-6 md:h-6 animate-bounce" />
      </motion.div>

      {/* 照片详情弹窗 */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/90 backdrop-blur-xl"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full mx-4 bg-card rounded-2xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={selectedPhoto.src || '/placeholder.svg'}
                  alt={selectedPhoto.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  onError={e => {
                    const target = e.currentTarget as HTMLImageElement
                    target.src = `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(
                      selectedPhoto.title
                    )}`
                  }}
                />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {selectedPhoto.title}
                </h3>
                <p className="text-muted-foreground text-lg">{selectedPhoto.desc}</p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-graphite/70 text-cream flex items-center justify-center hover:bg-graphite transition-colors backdrop-blur-sm"
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
