/**
 * @file 婚礼音乐播放器组件 - 优化版
 * @description 增强功能的婚礼音乐播放器，支持音频播放、进度控制、歌曲信息显示和美观的UI设计
 * @module wedding/music-player-final
 * @author YYC
 * @version 1.2.0
 * @created 2024-10-15
 * @updated 2024-10-15
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Music, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Heart } from 'lucide-react'

/**
 * 婚礼音乐播放器组件
 */
const WeddingMusicPlayer: React.FC = () => {
  // 状态管理
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  
  // 播放列表 - 包含entrance目录下所有5首歌曲
  const tracks = [
    {
      title: '今天你要嫁给我',
      artist: '沫言',
      src: '/music/entrance/沫言 - 今天你要嫁给我.mp3'
    },
    {
      title: '只有你',
      artist: '沫言',
      src: '/music/entrance/沫言 - 只有你.mp3'
    },
    {
      title: '给你们',
      artist: '沫言',
      src: '/music/entrance/沫言 - 给你们.mp3'
    },
    {
      title: '幸福的脸',
      artist: '沫语',
      src: '/music/entrance/沫语 - 幸福的脸.mp3'
    },
    {
      title: '爱你一万年',
      artist: '沫语',
      src: '/music/entrance/沫语 - 爱你一万年.mp3'
    }
  ]
  
  // 音频引用
  const audioRef = useRef<HTMLAudioElement>(null)
  
  // 初始化音量和喜欢的歌曲
  useEffect(() => {
    // 加载保存的音量设置
    const savedVolume = localStorage.getItem('musicPlayerVolume')
    if (savedVolume) {
      const parsedVolume = parseFloat(savedVolume)
      if (!isNaN(parsedVolume)) {
        setVolume(parsedVolume)
        if (audioRef.current) {
          audioRef.current.volume = parsedVolume
        }
      }
    }
    
    // 加载喜欢的歌曲设置
    const likedTracks = localStorage.getItem('likedTracks')
    if (likedTracks) {
      const parsedLikedTracks = JSON.parse(likedTracks)
      setIsLiked(parsedLikedTracks[currentTrack] || false)
    }
  }, [currentTrack])
  
  // 音量变化处理
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
      localStorage.setItem('musicPlayerVolume', volume.toString())
    }
  }, [volume, isMuted])
  
  // 播放/暂停控制
  const handlePlayPause = async () => {
    if (!audioRef.current) return
    
    try {
      setHasError(false)
      
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('播放控制错误:', error)
      setHasError(true)
      setErrorMessage('播放失败，请检查音频文件')
    }
  }
  
  // 切换到下一首 - 改进版，避免AbortError
  const handleNextTrack = async () => {
    if (!audioRef.current) return
    
    try {
      setHasError(false)
      
      // 先暂停当前播放
      if (isPlaying) {
        audioRef.current.pause()
      }
      
      const nextTrack = (currentTrack + 1) % tracks.length
      setCurrentTrack(nextTrack)
      setCurrentTime(0)
      setDuration(0)
      
      // 清除之前的事件监听器以避免冲突
      const newAudio = audioRef.current.cloneNode(true) as HTMLAudioElement
      audioRef.current.parentNode?.replaceChild(newAudio, audioRef.current)
      audioRef.current = newAudio
      
      // 设置新的音频源
      audioRef.current.src = tracks[nextTrack].src
      
      // 重新添加事件监听器
      audioRef.current.addEventListener('error', handleAudioError)
      audioRef.current.addEventListener('ended', handleAudioEnded)
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata)
      audioRef.current.volume = isMuted ? 0 : volume
      
      // 等待音频加载后再播放
      await audioRef.current.load()
      await audioRef.current.play()
      setIsPlaying(true)
    } catch (error) {
      console.error('切换歌曲播放失败:', error)
      setHasError(true)
      setErrorMessage('无法播放下一首歌曲')
      setIsPlaying(false)
    }
  }
  
  // 切换到上一首 - 改进版，避免AbortError
  const handlePrevTrack = async () => {
    if (!audioRef.current) return
    
    try {
      setHasError(false)
      
      // 先暂停当前播放
      if (isPlaying) {
        audioRef.current.pause()
      }
      
      const prevTrack = (currentTrack - 1 + tracks.length) % tracks.length
      setCurrentTrack(prevTrack)
      setCurrentTime(0)
      setDuration(0)
      
      // 清除之前的事件监听器以避免冲突
      const newAudio = audioRef.current.cloneNode(true) as HTMLAudioElement
      audioRef.current.parentNode?.replaceChild(newAudio, audioRef.current)
      audioRef.current = newAudio
      
      // 设置新的音频源
      audioRef.current.src = tracks[prevTrack].src
      
      // 重新添加事件监听器
      audioRef.current.addEventListener('error', handleAudioError)
      audioRef.current.addEventListener('ended', handleAudioEnded)
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata)
      audioRef.current.volume = isMuted ? 0 : volume
      
      // 等待音频加载后再播放
      await audioRef.current.load()
      await audioRef.current.play()
      setIsPlaying(true)
    } catch (error) {
      console.error('切换歌曲播放失败:', error)
      setHasError(true)
      setErrorMessage('无法播放上一首歌曲')
      setIsPlaying(false)
    }
  }
  
  // 处理进度变化
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }
  
  // 处理音频加载完成
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }
  
  // 处理进度条拖动
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return
    
    const newTime = parseFloat(e.target.value)
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }
  
  // 切换喜欢状态
  const toggleLike = () => {
    const newLikedState = !isLiked
    setIsLiked(newLikedState)
    
    // 保存喜欢的歌曲到本地存储
    const likedTracks = localStorage.getItem('likedTracks')
    const parsedLikedTracks = likedTracks ? JSON.parse(likedTracks) : {}
    parsedLikedTracks[currentTrack] = newLikedState
    localStorage.setItem('likedTracks', JSON.stringify(parsedLikedTracks))
  }
  
  // 格式化时间为 mm:ss 格式
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
  
  // 静音切换
  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }
  
  // 音量调节
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (newVolume > 0) {
      setIsMuted(false)
    }
  }
  
  // 音频错误处理
  const handleAudioError = () => {
    setHasError(true)
    setIsPlaying(false)
    setErrorMessage('音频文件加载失败')
  }
  
  // 音频结束处理 - 自动播放下一首
  const handleAudioEnded = () => {
    handleNextTrack()
  }
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* 音频元素 - 使用本地婚礼音乐文件 */}
      <audio 
        ref={audioRef}
        onError={handleAudioError}
        onEnded={handleAudioEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        preload="metadata"
        src={tracks[currentTrack].src}
        crossOrigin="anonymous"
      >
        您的浏览器不支持音频元素。
       </audio>
      
      {!isExpanded ? (
        // 迷你播放器 - 增强版
        <div 
          onClick={() => setIsExpanded(true)}
          className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center px-4 py-2 border border-gray-100 cursor-pointer hover:bg-white transition-all duration-300 group"
          aria-label="音乐播放器"
        >
          <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mr-3 group-hover:scale-105 transition-transform duration-300">
            <Music size={20} />
          </div>
          <div className="text-left mr-2 hidden sm:block">
            <div className="text-sm font-medium text-gray-800 truncate w-32">{tracks[currentTrack].title}</div>
            <div className="text-xs text-gray-500 truncate w-32">{tracks[currentTrack].artist}</div>
          </div>
          <div className="bg-gray-200 rounded-full h-1 flex-grow mr-3 overflow-hidden">
            <div 
              className="bg-amber-500 h-full transition-all duration-1000 ease-out"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handlePlayPause();
            }}
            className="w-8 h-8 rounded-full bg-transparent text-gray-700 hover:bg-gray-100 flex items-center justify-center"
            aria-label={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>
          {hasError && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          )}
        </div>
      ) : (
        // 展开播放器 - 增强版
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-5 w-80 sm:w-96 transform transition-all duration-500 ease-out">
          {/* 顶部控制栏 */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-xl text-gray-800 flex items-center">
              <Music size={20} className="mr-2 text-amber-500" />
              婚礼音乐
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={toggleLike}
                className={`p-2 rounded-full ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                aria-label={isLiked ? '取消收藏' : '收藏歌曲'}
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
                aria-label="收起播放器"
              >
                ✕
              </button>
            </div>
          </div>
          
          {/* 专辑封面区域 */}
          <div className="relative mb-6">
            <div className="aspect-square bg-gradient-to-br from-amber-100 to-pink-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
              <Music size={64} className="text-amber-400 opacity-50" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl pointer-events-none"></div>
          </div>
          
          {/* 歌曲信息 */}
          <div className="text-center mb-6">
            <h4 className="font-bold text-lg text-gray-900 mb-1 truncate">{tracks[currentTrack].title}</h4>
            <p className="text-gray-500 mb-1">{tracks[currentTrack].artist}</p>
            <div className="text-xs text-gray-400">婚礼背景音乐 {currentTrack + 1}/{tracks.length}</div>
          </div>
          
          {/* 进度条 */}
          <div className="mb-5">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-amber-500"
              aria-label="播放进度"
            />
            <div className="flex justify-between mt-1.5 text-xs text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* 播放控制按钮 */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={handlePrevTrack}
              className="p-3 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-label="上一首"
            >
              <SkipBack size={24} />
            </button>
            
            <button
              onClick={handlePlayPause}
              className={`w-16 h-16 rounded-full flex items-center justify-center ${isPlaying ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-amber-500 text-white hover:bg-amber-600'} shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95`}
              aria-label={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>
            
            <button
              onClick={handleNextTrack}
              className="p-3 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-label="下一首"
            >
              <SkipForward size={24} />
            </button>
          </div>
          
          {/* 音量控制 */}
          <div className="flex items-center space-x-3 mb-2">
            <button
              onClick={handleMuteToggle}
              className="text-gray-700 hover:text-amber-500 focus:outline-none p-1"
              aria-label={isMuted ? '取消静音' : '静音'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-amber-500"
              aria-label="音量"
            />
          </div>
          
          {/* 错误提示 */}
          {hasError && (
            <div className="mt-4 text-sm text-red-500 bg-red-50 p-3 rounded-lg flex items-start">
              <span className="mr-2 mt-0.5">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}
          
          {/* 底部版权信息 */}
          <div className="mt-4 text-xs text-gray-400 text-center opacity-75">
            婚礼背景音乐播放器 © 2024
          </div>
        </div>
      )}
    </div>
  )
}

export default WeddingMusicPlayer