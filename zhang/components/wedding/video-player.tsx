"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from "@/components/icons"

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  variant?: "default" | "card" | "minimal"
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  className?: string
  isMainVideo?: boolean // 标识是否为主视频区域
}

export default function VideoPlayer({
  src,
  poster,
  title,
  variant = "default",
  autoPlay = false,
  loop = true,
  muted = true,
  className = "",
  isMainVideo = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(muted)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false) // 跟踪用户是否手动操作过声音

  // 进度更新和播放状态处理
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100
      setProgress(progress || 0)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener("timeupdate", updateProgress)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)

    return () => {
      video.removeEventListener("timeupdate", updateProgress)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
    }
  }, [])

  // 视口检测和自动播放/声音控制
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current
          if (!video) return
          
          if (entry.isIntersecting) {
            // 进入视口：自动播放
            if (autoPlay) {
              video.play().catch(err => {
                console.log('自动播放失败（可能是浏览器限制）:', err)
              })
            }
            
            // 主视频区域：取消静音（除非用户手动操作过）
            if (isMainVideo && !userInteracted) {
              video.muted = false
              setIsMuted(false)
            }
          } else {
            // 离开视口：暂停播放（非主视频区域）
            if (!isMainVideo) {
              video.pause()
            }
            
            // 主视频区域离开视口：恢复静音（除非用户手动操作过）
            if (isMainVideo && !userInteracted) {
              video.muted = true
              setIsMuted(true)
            }
          }
        })
      },
      {
        threshold: 0.5, // 当视频区域50%可见时触发
        rootMargin: '-10% 0px -10% 0px' // 增加一些边距，让检测更灵敏
      }
    )

    const container = containerRef.current
    if (container) {
      observer.observe(container)
    }

    return () => {
      if (container) {
        observer.unobserve(container)
      }
    }
  }, [isMainVideo, userInteracted, autoPlay])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
      setUserInteracted(true) // 标记用户已手动操作
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = x / rect.width
      videoRef.current.currentTime = percentage * videoRef.current.duration
    }
  }

  // 样式变体
  const variants = {
    default: "rounded-2xl overflow-hidden border-2 border-gold/30 shadow-2xl bg-black",
    card: "rounded-xl overflow-hidden border border-border shadow-lg bg-black",
    minimal: "rounded-lg overflow-hidden bg-black",
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative group ${variants[variant]} ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* 视频元素 */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        preload="metadata"
        className="w-full h-full object-contain bg-black"
        onClick={togglePlay}
      />

      {/* 标题（仅card模式） */}
      {variant === "card" && title && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
            <h3 className="text-white font-semibold text-sm md:text-base">{title}</h3>
          </div>
        </div>
      )}

      {/* 播放/暂停按钮（中央） */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center z-10 bg-black/20"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold/90 backdrop-blur-md flex items-center justify-center hover:bg-gold transition-colors shadow-2xl">
              <Play className="w-8 h-8 md:w-10 md:h-10 text-graphite ml-1" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 控制栏 */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 z-20 bg-linear-to-t from-black/80 to-transparent p-4"
          >
            {/* 进度条 */}
            <div
              onClick={handleProgressClick}
              className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-3 relative overflow-hidden"
            >
              <motion.div
                className="absolute left-0 top-0 h-full bg-gold"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* 控制按钮 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white" />
                  )}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </motion.button>

                {title && variant !== "card" && (
                  <span className="text-white text-sm font-medium ml-2 hidden md:block">
                    {title}
                  </span>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleFullscreen}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-white" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-white" />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 装饰边框（仅default模式） */}
      {variant === "default" && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-gold rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-gold rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-gold rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-gold rounded-br-2xl" />
        </div>
      )}
    </motion.div>
  )
}

