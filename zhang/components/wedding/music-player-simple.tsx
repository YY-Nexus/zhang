/**
 * @file 婚礼音乐播放器组件 - 简化版
 * @description 婚礼音乐播放器，优化了路径处理和错误管理
 * @module wedding/music-player
 * @author YYC
 * @version 2.1.0
 * @created 2024-10-15
 * @updated 2024-10-15
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Music, Play, Pause, Volume2, Volume1, VolumeX, SkipBack, SkipForward } from 'lucide-react'

/**
 * 音频URL工具类 - 处理URL规范化和路径解析
 */
class UrlUtils {
  /**
   * 规范化音频URL，处理相对路径和特殊字符
   */
  static normalizeAudioUrl(url: string): string {
    try {
      // 检查是否为绝对URL
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
      }
      
      // 处理相对路径
      // 假设音频文件在public/audio目录下
      if (!url.startsWith('/')) {
        url = `/audio/${url}`
      }
      
      // 处理中文字符和特殊字符
      return encodeURI(url)
    } catch (error) {
      console.error('URL规范化错误:', error)
      return url
    }
  }
}

/**
 * 时间工具类 - 处理音频时间格式化
 */
class TimeUtils {
  /**
   * 将秒转换为分:秒格式
   */
  static formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00'
    
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
}

/**
 * 播放器状态类型
 */
type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

/**
 * 音频轨道类型
 */
interface AudioTrack {
  id: string
  title: string
  artist: string
  audioUrl: string
  coverUrl?: string
}

/**
 * 婚礼音乐播放器组件
 */
const WeddingMusicPlayer: React.FC = () => {
  // 播放器状态
  const [playerState, setPlayerState] = useState<PlayerStatus>('idle')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('musicPlayerVolume')
    return saved ? parseFloat(saved) : 0.7
  })
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  // 音频引用
  const audioRef = useRef<HTMLAudioElement>(null)
  
  // 示例音频列表
  const [tracks, setTracks] = useState<AudioTrack[]>([
    {
      id: '1',
      title: '婚礼进行曲',
      artist: '经典婚礼音乐',
      audioUrl: 'wedding-march.mp3'
    },
    {
      id: '2', 
      title: '幸福时刻',
      artist: '浪漫钢琴曲',
      audioUrl: 'happy-moment.mp3'
    }
  ])
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  
  const currentTrack = tracks[currentTrackIndex]
  
  // 音量变化处理
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
      localStorage.setItem('musicPlayerVolume', volume.toString())
    }
  }, [volume, isMuted])
  
  // 轨道变化处理
  useEffect(() => {
    if (!currentTrack) return
    
    setPlayerState('loading')
    setHasError(false)
    setErrorMessage('')
    
    const audio = audioRef.current
    if (!audio) return
    
    try {
      // 使用URL工具类规范化音频URL
      const normalizedUrl = UrlUtils.normalizeAudioUrl(currentTrack.audioUrl)
      audio.src = normalizedUrl
      
      // 尝试加载音频
      audio.load()
      
      // 设置事件处理
      const handleLoadedMetadata = () => {
        setDuration(audio.duration || 0)
        setPlayerState('paused')
        // 尝试自动播放（可能受浏览器限制）
        audio.play().then(() => {
          setPlayerState('playing')
        }).catch(() => {
          // 自动播放失败时，保持暂停状态
          setPlayerState('paused')
        })
      }
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime)
      }
      
      const handleEnded = () => {
        // 播放下一首
        handleNext()
      }
      
      const handleError = (event: Event) => {
        setHasError(true)
        setPlayerState('error')
        setErrorMessage('音频加载失败，请检查网络连接或文件格式')
        console.error('音频加载错误:', event)
      }
      
      // 添加事件监听器
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('error', handleError)
      
      // 清理函数
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('error', handleError)
      }
    } catch (error) {
      console.error('音频设置错误:', error)
      setHasError(true)
      setPlayerState('error')
      setErrorMessage('播放器初始化失败')
    }
  }, [currentTrack])
  
  // 播放/暂停切换
  const handlePlayPause = () => {
    if (!audioRef.current) return
    
    try {
      if (playerState === 'playing') {
        audioRef.current.pause()
        setPlayerState('paused')
      } else if (playerState === 'paused' || playerState === 'idle') {
        audioRef.current.play().then(() => {
          setPlayerState('playing')
        }).catch(error => {
          console.error('播放失败:', error)
          setHasError(true)
          setPlayerState('error')
          setErrorMessage('播放失败，请手动点击播放按钮')
        })
      }
    } catch (error) {
      console.error('播放控制错误:', error)
      setHasError(true)
      setPlayerState('error')
    }
  }
  
  // 上一首
  const handlePrevious = () => {
    setCurrentTrackIndex(prev => 
      prev === 0 ? tracks.length - 1 : prev - 1
    )
  }
  
  // 下一首
  const handleNext = () => {
    setCurrentTrackIndex(prev => 
      prev === tracks.length - 1 ? 0 : prev + 1
    )
  }
  
  // 进度条拖动
  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }
  
  // 音量调节
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }
  
  // 静音切换
  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }
  
  // 渲染音量图标
  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  }
  
  return (
    <div className="fixed bottom-4 left-4 z-40">
      {/* 音频元素 */}
      <audio ref={audioRef} />
      
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 rounded-full bg-gold shadow-lg shadow-gold/30 flex items-center justify-center text-graphite hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          aria-label="展开音乐播放器"
        >
          <Music className="w-6 h-6" />
          {hasError && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          )}
        </button>
      ) : (
        <div className="w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">婚礼音乐</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="收起音乐播放器"
            >
              ✕
            </button>
          </div>
          
          {/* 当前播放信息 */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-800 truncate">{currentTrack?.title || '未知歌曲'}</h4>
            <p className="text-sm text-gray-500 truncate">{currentTrack?.artist || '未知艺术家'}</p>
          </div>
          
          {/* 进度条 */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gold"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{TimeUtils.formatTime(currentTime)}</span>
              <span>{TimeUtils.formatTime(duration)}</span>
            </div>
          </div>
          
          {/* 控制按钮 */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevious}
              className="text-gray-700 hover:text-gold p-2 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded-full"
              aria-label="上一首"
            >
              <SkipBack size={24} />
            </button>
            
            <button
              onClick={handlePlayPause}
              className={`w-12 h-12 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 ${playerState === 'playing' ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-gold text-white hover:bg-amber-500'}`}
              aria-label={playerState === 'playing' ? '暂停' : '播放'}
            >
              {playerState === 'playing' ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <button
              onClick={handleNext}
              className="text-gray-700 hover:text-gold p-2 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded-full"
              aria-label="下一首"
            >
              <SkipForward size={24} />
            </button>
          </div>
          
          {/* 音量控制 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMuteToggle}
              className="text-gray-700 hover:text-gold p-1 focus:outline-none"
              aria-label={isMuted ? '取消静音' : '静音'}
            >
              {renderVolumeIcon()}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gold"
              aria-label="音量"
            />
          </div>
          
          {/* 错误信息 */}
          {hasError && (
            <div className="mt-3 text-sm text-red-500 bg-red-50 p-2 rounded">
              {errorMessage}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default WeddingMusicPlayer
