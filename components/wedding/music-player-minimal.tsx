/**
 * @file 婚礼音乐播放器组件 - 极简版
 * @description 基础音乐播放器，优化了错误处理
 * @module wedding/music-player-minimal
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause } from 'lucide-react'

const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 播放控制
  const togglePlay = async () => {
    if (!audioRef.current) return
    
    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
      }
      setError(null)
    } catch (err) {
      console.error('播放错误:', err)
      setError('无法播放音频，请手动点击播放')
    }
  }
  
  // 音频加载错误处理
  const handleError = () => {
    setError('音频文件加载失败')
    setIsPlaying(false)
  }
  
  // 音频结束处理
  const handleEnded = () => {
    setIsPlaying(false)
  }
  
  return (
    <div className="fixed bottom-4 left-4 z-40">
      <audio 
        ref={audioRef} 
        onError={handleError}
        onEnded={handleEnded}
        preload="metadata"
      />
      
      <button
        onClick={togglePlay}
        className="w-14 h-14 rounded-full bg-gold flex items-center justify-center text-white shadow-lg hover:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
        aria-label={isPlaying ? "暂停音乐" : "播放音乐"}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      
      {error && (
        <div className="mt-2 p-2 bg-red-50 text-red-600 text-xs rounded shadow">
          {error}
        </div>
      )}
    </div>
  )
}

export default MusicPlayer