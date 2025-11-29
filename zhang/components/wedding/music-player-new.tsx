/**
 * @file 婚礼音乐播放器组件 - 全新重构版
 * @description 完全重写的婚礼现场音乐播放控制组件，采用现代架构设计，优化了路径处理、错误管理和用户体验
 * @module components/wedding/music-player-new
 * @author YYC
 * @version 2.1.0
 * @created 2024-10-15
 * @updated 2024-10-15
 */
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  ChevronUp,
  ListMusic,
  Heart,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { formatDuration, getPlaylistBySegment, segmentLabels, moodEmojis } from '@/lib/music-playlist'
import type { MusicSegment, Track } from '@/lib/music-playlist'

// 🛡️ 类型定义
interface PlayerState {
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'error'
  errorMessage?: string
}

interface AudioUrlHandler {
  normalizeUrl: (url: string) => string
  isLocalFile: (url: string) => boolean
  getDisplayUrl: (url: string) => string
}

interface TrackMetadata {
  currentTime: number
  duration: number
  progress: number
}

// 🧰 工具类
class UrlUtils implements AudioUrlHandler {
  /**
   * 规范化音频URL路径
   * @param url 原始URL
   * @returns 规范化后的URL
   */
  normalizeUrl(url: string): string {
    // 处理空URL
    if (!url) {
      throw new Error('URL不能为空')
    }
    
    // 处理blob URL (本地文件)
    if (url.startsWith('blob:')) {
      return url
    }
    
    // 确保URL以/开头
    let normalized = url.startsWith('/') ? url : `/${url}`
    
    // 对于绝对URL，直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    
    // 确保中文字符路径正确处理
    try {
      // 只对非编码的URL进行编码处理
      const encodedUrl = encodeURI(normalized)
      return encodedUrl
    } catch (error) {
      console.warn('URL编码失败，使用原始URL:', error)
      return normalized
    }
  }
  
  /**
   * 检查是否为本地文件
   * @param url 要检查的URL
   * @returns 是否为本地文件
   */
  isLocalFile(url: string): boolean {
    return url.startsWith('blob:') || url.startsWith('file:')
  }
  
  /**
   * 获取用于显示的URL
   * @param url 原始URL
   * @returns 显示用的URL
   */
  getDisplayUrl(url: string): string {
    if (this.isLocalFile(url)) {
      return '本地文件'
    }
    // 获取文件名部分
    const parts = url.split('/')
    return parts[parts.length - 1] || url
  }
}

class TimeUtils {
  /**
   * 格式化时间
   * @param seconds 秒数
   * @returns 格式化后的时间字符串 (mm:ss)
   */
  static format(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
}

// 🌐 常量定义
const SEGMENT_CONFIG: Record<MusicSegment, { label: string; emoji: string }> = {
  entrance: { label: segmentLabels.entrance, emoji: '🎊' },
  tea: { label: segmentLabels.tea, emoji: '🍵' },
  dining: { label: segmentLabels.dining, emoji: '🍽️' },
  farewell: { label: segmentLabels.farewell, emoji: '👋' },
}

const URL_UTILS = new UrlUtils()

/**
 * 婚礼音乐播放器组件
 * @description 现代化的婚礼音乐播放控制组件
 */
const WeddingMusicPlayer = () => {
  // 📊 状态管理
  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 播放器状态
  const [playerState, setPlayerState] = useState<PlayerState>({ status: 'idle' })
  const [isExpanded, setIsExpanded] = useState(false)
  
  // 播放列表状态
  const [currentSegment, setCurrentSegment] = useState<MusicSegment>('entrance')
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [playlists, setPlaylists] = useState<Record<MusicSegment, Track[]>>({
    entrance: getPlaylistBySegment('entrance'),
    tea: getPlaylistBySegment('tea'),
    dining: getPlaylistBySegment('dining'),
    farewell: getPlaylistBySegment('farewell'),
  })
  
  // 音频控制状态
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [metadata, setMetadata] = useState<TrackMetadata>({
    currentTime: 0,
    duration: 0,
    progress: 0
  })
  
  // 用户交互状态
  const [votedTracks, setVotedTracks] = useState<Set<string>>(new Set())
  const [localAudioUrl, setLocalAudioUrl] = useState<string | null>(null)
  
  // 同步状态
  const [syncState, setSyncState] = useState<'disconnected' | 'connecting' | 'synced'>('disconnected')
  const [connectedDevices, setConnectedDevices] = useState(0)
  
  // 🎛️ 核心功能钩子
  
  // 加载存储的音量设置
  useEffect(() => {
    const loadVolume = () => {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('wedding_music_volume')
          if (stored) {
            setVolume(Number.parseFloat(stored))
          }
        } catch (error) {
          console.warn('加载音量设置失败:', error)
        }
      }
    }
    loadVolume()
  }, [])
  
  // 保存音量设置
  useEffect(() => {
    if (typeof window !== 'undefined' && !isMuted) {
      try {
        localStorage.setItem('wedding_music_volume', volume.toString())
      } catch (error) {
        console.warn('保存音量设置失败:', error)
      }
    }
  }, [volume, isMuted])
  
  // 音频元素事件监听
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    const handleLoadedMetadata = () => {
      setMetadata(prev => ({
        ...prev,
        duration: audio.duration || 0
      }))
      setPlayerState({ status: 'paused' })
    }
    
    const handleTimeUpdate = () => {
      const duration = audio.duration || 0
      const currentTime = audio.currentTime || 0
      const progress = duration > 0 ? (currentTime / duration) * 100 : 0
      
      setMetadata({
        currentTime,
        duration,
        progress
      })
    }
    
    const handleEnded = () => {
      // 全歌单循环：自动播放下一首
      handleNext()
    }
    
    const handleError = (errorEvent: Event) => {
      const target = errorEvent.target as HTMLAudioElement
      const errorCode = target.error ? target.error.code : -1
      
      let errorMessage = '音频加载失败'
      switch (errorCode) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = '音频加载被中断'
          break
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = '网络错误导致加载失败'
          break
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = '音频格式不支持或已损坏'
          break
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = '音频源不被支持'
          break
        default:
          errorMessage = '未知错误导致加载失败'
      }
      
      console.error('音频播放错误:', errorCode, errorMessage)
      setPlayerState({ status: 'error', errorMessage })
      
      // 3秒后尝试播放下一首
      setTimeout(() => {
        handleNext()
      }, 3000)
    }
    
    const handleCanPlay = () => {
      if (playerState.status === 'loading') {
        setPlayerState({ status: 'paused' })
      }
    }
    
    // 添加事件监听器
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('canplay', handleCanPlay)
    
    // 清理函数
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [playerState.status])
  
  // 音量控制
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])
  
  // 模拟同步功能
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (syncState === 'synced') {
      interval = setInterval(() => {
        setConnectedDevices(Math.floor(Math.random() * 5) + 1)
      }, 5000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [syncState])
  
  // 曲目变化时自动加载和播放
  useEffect(() => {
    const currentPlaylist = playlists[currentSegment]
    const currentTrack = currentPlaylist[currentTrackIndex]
    
    if (currentTrack?.audioUrl && audioRef.current) {
      try {
        setPlayerState({ status: 'loading' })
        
        // 使用工具类规范化URL
        const normalizedUrl = URL_UTILS.normalizeUrl(currentTrack.audioUrl)
        
        // 设置并加载音频
        audioRef.current.src = normalizedUrl
        audioRef.current.load()
        
        console.log('正在加载音频:', URL_UTILS.getDisplayUrl(normalizedUrl))
        
        // 自动播放（延迟一下确保加载完成）
        const playTimer = setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play()
              .then(() => {
                setPlayerState({ status: 'playing' })
              })
              .catch((error) => {
                // 浏览器可能阻止自动播放，这是正常的
                console.log('自动播放失败（可能是浏览器限制）:', error)
                setPlayerState({ status: 'paused' })
              })
          }
        }, 500)
        
        return () => clearTimeout(playTimer)
      } catch (error) {
        console.error('音频配置错误:', error)
        setPlayerState({ 
          status: 'error', 
          errorMessage: '音频配置错误，请检查URL格式' 
        })
      }
    }
  }, [currentSegment, currentTrackIndex, playlists])
  
  // 🎮 播放控制函数
  
  /**
   * 切换播放/暂停
   */
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    
    try {
      if (playerState.status === 'playing') {
        // 暂停播放
        await audio.pause()
        setPlayerState({ status: 'paused' })
      } else {
        // 尝试播放
        if (!audio.src && !localAudioUrl) {
          // 如果没有加载音频，尝试加载当前曲目
          const currentPlaylist = playlists[currentSegment]
          const currentTrack = currentPlaylist[currentTrackIndex]
          
          if (currentTrack?.audioUrl) {
            setPlayerState({ status: 'loading' })
            const normalizedUrl = URL_UTILS.normalizeUrl(currentTrack.audioUrl)
            audio.src = normalizedUrl
            await audio.load()
          }
        }
        
        // 执行播放
        await audio.play()
        setPlayerState({ status: 'playing' })
      }
    } catch (error) {
      console.error('播放控制错误:', error)
      
      // 特殊处理用户交互限制
      if (error instanceof Error && error.name === 'NotAllowedError') {
        setPlayerState({
          status: 'error',
          errorMessage: '请点击播放器进行播放（浏览器限制）'
        })
      } else {
        setPlayerState({
          status: 'error',
          errorMessage: '播放失败，请重试'
        })
      }
    }
  }, [playerState.status, playlists, currentSegment, currentTrackIndex, localAudioUrl])
  
  /**
   * 播放上一首
   */
  const handlePrevious = useCallback(() => {
    const currentPlaylist = playlists[currentSegment]
    setCurrentTrackIndex(prev => 
      prev === 0 ? currentPlaylist.length - 1 : prev - 1
    )
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }, [playlists, currentSegment])
  
  /**
   * 播放下一首（支持全歌单循环）
   */
  const handleNext = useCallback(() => {
    const currentPlaylist = playlists[currentSegment]
    const nextIndex = currentTrackIndex === currentPlaylist.length - 1 ? 0 : currentTrackIndex + 1
    
    // 如果当前环节播放完了，切换到下一个环节
    if (nextIndex === 0 && currentTrackIndex === currentPlaylist.length - 1) {
      const segments: MusicSegment[] = ['entrance', 'tea', 'dining', 'farewell']
      const currentSegmentIndex = segments.indexOf(currentSegment)
      const nextSegment = segments[(currentSegmentIndex + 1) % segments.length]
      
      setCurrentSegment(nextSegment)
      setCurrentTrackIndex(0)
    } else {
      setCurrentTrackIndex(nextIndex)
    }
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }, [playlists, currentSegment, currentTrackIndex])
  
  /**
   * 处理进度条点击
   */
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio) return
    
    try {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = clickX / rect.width
      const newTime = percentage * audio.duration
      
      audio.currentTime = newTime
      setMetadata(prev => ({
        ...prev,
        currentTime: newTime,
        progress: percentage * 100
      }))
    } catch (error) {
      console.error('进度调整错误:', error)
    }
  }, [])
  
  /**
   * 处理音量变化
   */
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(Math.max(0, Math.min(1, newVolume)))
    
    if (newVolume === 0 && !isMuted) {
      setIsMuted(true)
    } else if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }, [isMuted])
  
  /**
   * 切换静音状态
   */
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])
  
  /**
   * 处理歌曲投票
   */
  const handleVote = useCallback((trackId: string) => {
    if (votedTracks.has(trackId)) return
    
    // 更新投票状态
    setVotedTracks(prev => new Set([...prev, trackId]))
    
    // 更新本地播放列表并重新排序
    setPlaylists(prev => {
      const updatedSegment = [...prev[currentSegment]]
        .map(t => (t.id === trackId ? { ...t, votes: t.votes + 1 } : t))
        .sort((a, b) => {
          // 按投票数和优先级排序
          if (b.votes !== a.votes) return b.votes - a.votes
          return b.priority - a.priority
        })
      
      return {
        ...prev,
        [currentSegment]: updatedSegment
      }
    })
  }, [votedTracks, currentSegment])
  
  /**
   * 处理本地文件上传
   */
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    // 验证文件类型
    if (!file.type.startsWith('audio/')) {
      alert('请上传音频文件！')
      return
    }
    
    try {
      // 创建本地URL并加载
      const url = URL.createObjectURL(file)
      setLocalAudioUrl(url)
      setPlayerState({ status: 'loading' })
      
      // 清理之前的blob URL
      if (audioRef.current) {
        const oldSrc = audioRef.current.src
        audioRef.current.src = url
        audioRef.current.load()
        
        // 延迟清理旧的blob URL
        setTimeout(() => {
          if (oldSrc && oldSrc.startsWith('blob:')) {
            try {
              URL.revokeObjectURL(oldSrc)
            } catch (e) {
              console.warn('清理blob URL失败:', e)
            }
          }
        }, 100)
      }
    } catch (error) {
      console.error('文件上传处理错误:', error)
      setPlayerState({
        status: 'error',
        errorMessage: '文件处理失败，请重试'
      })
    }
  }, [])
  
  /**
   * 处理同步连接
   */
  const handleSyncConnect = useCallback(() => {
    setSyncState('connecting')
    
    // 模拟连接过程
    setTimeout(() => {
      setSyncState('synced')
      setConnectedDevices(Math.floor(Math.random() * 5) + 1)
    }, 1500)
  }, [])
  
  // 📋 辅助计算
  const currentPlaylist = playlists[currentSegment]
  const currentTrack = currentPlaylist[currentTrackIndex]
  const isPlaying = playerState.status === 'playing'
  const isLoading = playerState.status === 'loading'
  const hasError = playerState.status === 'error'
  const isIdle = playerState.status === 'idle'
  
  // 🖼️ UI渲染
  return (
    <>
      {/* 隐藏的音频元素 */}
      <audio 
        ref={audioRef} 
        preload="metadata"
        className="hidden"
      />
      
      {/* 隐藏的文件上传input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
        aria-label="上传音乐文件"
      />
      
      {/* 音乐播放器主容器 */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, type: 'spring' }}
        className="fixed bottom-4 left-4 z-40"
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.button
              key="mini-player"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setIsExpanded(true)}
              className="w-14 h-14 rounded-full bg-gold shadow-lg shadow-gold/30 flex items-center justify-center text-graphite hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              aria-label="展开音乐播放器"
              aria-expanded={isExpanded}
            >
              <Music className="w-6 h-6" />
              {isPlaying && <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />}
              {hasError && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" aria-hidden="true" />}
            </motion.button>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-80 bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border overflow-hidden"
              role="region"
              aria-label="婚礼音乐播放器"
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 bg-gold/10 border-b border-border">
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-gold" aria-hidden="true" />
                  <span className="font-semibold text-foreground">婚礼音乐</span>
                  <span className="text-xs text-muted-foreground">
                    ({currentPlaylist.length}首)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSyncConnect}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${syncState === 'synced' ? 'text-green-500' : 'text-muted-foreground hover:text-foreground'}`}
                    aria-label={
                      syncState === 'synced' 
                        ? `已同步 ${connectedDevices} 台设备` 
                        : '点击同步'
                    }
                  >
                    {syncState === 'synced' ? (
                      <Wifi className="w-4 h-4" />
                    ) : syncState === 'connecting' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Wifi className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <WifiOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    aria-label="收起播放器"
                  >
                    <ChevronUp className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
              
              {/* 环节选择 */}
              <div
                className="flex p-2 gap-1 border-b border-border"
                role="tablist"
                aria-label="婚礼环节"
              >
                {(Object.keys(SEGMENT_CONFIG) as MusicSegment[]).map(segment => (
                  <button
                    key={segment}
                    role="tab"
                    aria-selected={currentSegment === segment}
                    aria-controls={`panel-${segment}`}
                    onClick={() => {
                      setCurrentSegment(segment)
                      setCurrentTrackIndex(0)
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold
                      ${currentSegment === segment ? 'bg-gold text-graphite' : 'text-muted-foreground hover:bg-muted'}
                    `}
                  >
                    <span className="mr-1" aria-hidden="true">
                      {SEGMENT_CONFIG[segment].emoji}
                    </span>
                    {SEGMENT_CONFIG[segment].label}
                  </button>
                ))}
              </div>
              
              {/* 播放信息与控制 */}
              <div className="p-4" role="tabpanel" id={`panel-${currentSegment}`}>
                {/* 当前播放信息 */}
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{
                      duration: 3,
                      repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
                      ease: 'linear',
                    }}
                    className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center"
                  >
                    <ListMusic className="w-6 h-6 text-gold" aria-hidden="true" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {currentTrack?.title || '未选择歌曲'}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentTrack?.artist || '-'} 
                      {currentTrack && (
                        <span className="ml-2">{moodEmojis[currentTrack.mood]}</span>
                      )}
                    </p>
                  </div>
                  {currentTrack && (
                    <button
                      onClick={() => handleVote(currentTrack.id)}
                      disabled={votedTracks.has(currentTrack.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold
                        ${votedTracks.has(currentTrack.id) 
                          ? 'bg-gold/20 text-gold' 
                          : 'bg-muted text-muted-foreground hover:bg-gold/10 hover:text-gold'}`}
                      aria-label={
                        votedTracks.has(currentTrack.id)
                          ? `已投票，当前 ${currentTrack.votes} 票`
                          : `投票给这首歌，当前 ${currentTrack.votes} 票`
                      }
                    >
                      <Heart
                        className={`w-3 h-3 ${votedTracks.has(currentTrack.id) ? 'fill-gold' : ''}`}
                        aria-hidden="true"
                      />
                      {currentTrack.votes}
                    </button>
                  )}
                </div>
                
                {/* 进度条 */}
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>{TimeUtils.format(metadata.currentTime)}</span>
                  <span>{metadata.duration > 0 ? TimeUtils.format(metadata.duration) : '0:00'}</span>
                </div>
                <div
                  className={`h-2 rounded-full mb-4 overflow-hidden cursor-pointer hover:h-3 transition-all
                    ${hasError ? 'bg-red-100' : 'bg-muted'}
                  `}
                  role="progressbar"
                  aria-valuenow={metadata.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="播放进度"
                  onClick={handleProgressClick}
                >
                  <div
                    className={`h-full rounded-full transition-all
                      ${hasError ? 'bg-red-400' : 'bg-gold'}
                    `}
                    style={{ width: `${metadata.progress}%` }}
                  />
                </div>
                
                {/* 控制按钮 */}
                <div className="flex items-center justify-center gap-4 mb-3">
                  <button
                    onClick={toggleMute}
                    className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    aria-label={isMuted ? '取消静音' : '静音'}
                    aria-pressed={isMuted}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={handlePrevious}
                    className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    aria-label="上一首"
                    disabled={hasError}
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={togglePlay}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2
                      ${hasError ? 'bg-red-100 text-red-500' : 'bg-gold text-graphite hover:bg-gold/90'}
                    `}
                    aria-label={isPlaying ? '暂停' : '播放'}
                    aria-pressed={isPlaying}
                    disabled={hasError}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Clock className="w-6 h-6" />
                      </motion.div>
                    ) : hasError ? (
                      <AlertTriangle className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </button>
                  
                  <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    aria-label="下一首"
                    disabled={hasError}
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                  
                  <div className="w-8 h-8" />
                </div>
                
                {/* 上传音乐按钮 */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-4 bg-gold/10 hover:bg-gold/20 text-gold rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <Music className="w-4 h-4" />
                  {localAudioUrl ? '更换本地音乐' : '上传本地音乐'}
                </button>
                
                {/* 状态提示 */}
                {(hasError || isLoading || isIdle) && (
                  <div className="mt-2 text-xs text-center">
                    {hasError && playerState.errorMessage && (
                      <p className="text-red-500 flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {playerState.errorMessage}
                      </p>
                    )}
                    
                    {isLoading && (
                      <p className="text-blue-500 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" />
                        正在加载音频...
                      </p>
                    )}
                    
                    {isIdle && !localAudioUrl && (
                      <p className="text-muted-foreground flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        点击播放开始音乐
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {/* 播放列表 */}
              <div
                className="border-t border-border max-h-40 overflow-y-auto scrollbar-thin"
                role="list"
                aria-label={`${SEGMENT_CONFIG[currentSegment].label}环节播放列表`}
              >
                {currentPlaylist.map((track, index) => (
                  <button
                    key={track.id}
                    role="listitem"
                    onClick={() => setCurrentTrackIndex(index)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors focus:outline-none focus-visible:bg-gold/10
                      ${track.id === currentTrack?.id ? 'bg-gold/10' : ''}
                    `}
                    aria-current={track.id === currentTrack?.id ? 'true' : undefined}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${index === 0 ? 'bg-gold text-graphite' : 'bg-muted text-muted-foreground'}
                      `}
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1 text-left min-w-0">
                      <p
                        className={`text-sm truncate
                          ${track.id === currentTrack?.id
                            ? 'text-gold font-medium'
                            : 'text-foreground'
                        }`}
                      >
                        {track.title}
                        <span className="ml-1 text-xs">{moodEmojis[track.mood]}</span>
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {track.artist} · {TimeUtils.format(track.duration)}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Heart
                        className={`w-3 h-3 ${votedTracks.has(track.id) ? 'fill-gold text-gold' : ''}`}
                        aria-hidden="true"
                      />
                      <span aria-label={`${track.votes} 票`}>{track.votes}</span>
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

export default WeddingMusicPlayer
