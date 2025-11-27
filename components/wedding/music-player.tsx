'use client'

import {
  formatDuration,
  getPlaylistBySegment,
  moodEmojis,
  segmentLabels,
  weddingPlaylist,
  type MusicSegment,
  type Track,
} from '@/lib/music-playlist'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronUp,
  Heart,
  ListMusic,
  Music,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

type PlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'error'
type SyncState = 'disconnected' | 'connecting' | 'synced'

const segmentConfig: Record<MusicSegment, { label: string; emoji: string }> = {
  entrance: { label: segmentLabels.entrance, emoji: '🎊' },
  tea: { label: segmentLabels.tea, emoji: '🍵' },
  dining: { label: segmentLabels.dining, emoji: '🍽️' },
  farewell: { label: segmentLabels.farewell, emoji: '👋' },
}

// 音量记忆
function getStoredVolume(): number {
  if (typeof window === 'undefined') return 0.8
  const stored = localStorage.getItem('wedding_music_volume')
  return stored ? Number.parseFloat(stored) : 0.8
}

function setStoredVolume(volume: number): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('wedding_music_volume', volume.toString())
  }
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const [playerState, setPlayerState] = useState<PlayerState>('idle')
  const [syncState, setSyncState] = useState<SyncState>('disconnected')

  const [currentSegment, setCurrentSegment] = useState<MusicSegment>('entrance')
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [playlists, setPlaylists] = useState<Record<MusicSegment, Track[]>>({
    entrance: getPlaylistBySegment('entrance'),
    tea: getPlaylistBySegment('tea'),
    dining: getPlaylistBySegment('dining'),
    farewell: getPlaylistBySegment('farewell'),
  })
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [votedTracks, setVotedTracks] = useState<Set<string>>(new Set())
  const [connectedDevices, setConnectedDevices] = useState(0)
  const [localAudioUrl, setLocalAudioUrl] = useState<string | null>(null)

  const sessionId = 'wedding_zhangbo_dengrui_2025'

  // 加载存储的音量
  useEffect(() => {
    const storedVolume = getStoredVolume()
    setVolume(storedVolume)
  }, [])

  // 音频元素初始化
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setPlayerState('paused')
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      setProgress((audio.currentTime / audio.duration) * 100)
    }

    const handleEnded = () => {
      setPlayerState('paused')
      handleNext()
    }

    const handleError = () => {
      setPlayerState('error')
      console.error('音频加载失败')
    }

    const handleCanPlay = () => {
      if (playerState === 'loading') {
        setPlayerState('paused')
      }
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('canplay', handleCanPlay)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [playerState])

  // 音量控制
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // 模拟同步
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (syncState === 'synced') {
      interval = setInterval(() => {
        setConnectedDevices(Math.floor(Math.random() * 5) + 1)
      }, 5000)
    }

    return () => clearInterval(interval)
  }, [syncState])

  const currentPlaylist = playlists[currentSegment]
  const currentTrack = currentPlaylist[currentTrackIndex]

  // 当曲目变化时，自动加载音频文件
  useEffect(() => {
    if (currentTrack?.audioUrl && audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl
      audioRef.current.load()
      setPlayerState('paused')
    }
  }, [currentTrack])

  // 本地音频上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('audio/')) {
      alert('请上传音频文件！')
      return
    }

    const url = URL.createObjectURL(file)
    setLocalAudioUrl(url)
    setPlayerState('loading')

    // 加载本地音频
    if (audioRef.current) {
      audioRef.current.src = url
      audioRef.current.load()
    }
  }

  const handleVote = useCallback(
    async (trackId: string) => {
      if (votedTracks.has(trackId)) return

      setVotedTracks(prev => new Set([...prev, trackId]))

      // 更新本地投票数并重新排序
      setPlaylists(prev => {
        const updatedSegment = prev[currentSegment]
          .map(t => (t.id === trackId ? { ...t, votes: t.votes + 1 } : t))
          .sort((a, b) => {
            if (b.votes !== a.votes) return b.votes - a.votes
            return b.priority - a.priority
          })

        return {
          ...prev,
          [currentSegment]: updatedSegment,
        }
      })
    },
    [votedTracks, currentSegment]
  )

  const handleSyncConnect = useCallback(async () => {
    setSyncState('connecting')
    // 模拟连接
    setTimeout(() => {
      setSyncState('synced')
      setConnectedDevices(Math.floor(Math.random() * 5) + 1)
    }, 1000)
  }, [])

  // 播放控制
  const togglePlay = async () => {
    if (!audioRef.current) return

    try {
      if (playerState === 'playing') {
        audioRef.current.pause()
        setPlayerState('paused')
      } else {
        // 如果是第一次播放且没有音频源，提示用户上传
        if (!audioRef.current.src && !localAudioUrl) {
          alert(
            '请先上传音乐文件，或者联系管理员添加在线音乐。\n点击右下角【上传音乐】按钮即可！🎵'
          )
          return
        }

        await audioRef.current.play()
        setPlayerState('playing')
      }
    } catch (error) {
      console.error('播放失败:', error)
      setPlayerState('error')
      alert('播放失败，请检查音频文件格式！')
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    setStoredVolume(newVolume)
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const handlePrevious = () => {
    setCurrentTrackIndex(prev => (prev === 0 ? currentPlaylist.length - 1 : prev - 1))
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  const handleNext = () => {
    setCurrentTrackIndex(prev => (prev === currentPlaylist.length - 1 ? 0 : prev + 1))
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * audioRef.current.duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  return (
    <>
      {/* 隐藏的音频元素 */}
      <audio ref={audioRef} preload="metadata" />

      {/* 隐藏的文件上传input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
        aria-label="上传音乐文件"
      />

      {/* 迷你播放器 - 左下角 */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, type: 'spring' }}
        className="fixed bottom-4 left-4 z-40"
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.button
              key="mini"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setIsExpanded(true)}
              className="w-14 h-14 rounded-full bg-gold shadow-lg shadow-gold/30 flex items-center justify-center text-graphite hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              aria-label="展开音乐播放器"
              aria-expanded={isExpanded}
            >
              <Music className="w-6 h-6" />
              {playerState === 'playing' && (
                <span
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"
                  aria-hidden="true"
                />
              )}
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
                    ({weddingPlaylist.length}首)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSyncConnect}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                      syncState === 'synced'
                        ? 'text-green-500'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    aria-label={
                      syncState === 'synced' ? `已同步 ${connectedDevices} 台设备` : '点击同步'
                    }
                    title={
                      syncState === 'synced' ? `已同步 ${connectedDevices} 台设备` : '点击同步'
                    }
                  >
                    {syncState === 'synced' ? (
                      <Wifi className="w-4 h-4" />
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
                {(Object.keys(segmentConfig) as MusicSegment[]).map(segment => (
                  <button
                    key={segment}
                    role="tab"
                    aria-selected={currentSegment === segment}
                    aria-controls={`panel-${segment}`}
                    onClick={() => {
                      setCurrentSegment(segment)
                      setCurrentTrackIndex(0)
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                      currentSegment === segment
                        ? 'bg-gold text-graphite'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="mr-1" aria-hidden="true">
                      {segmentConfig[segment].emoji}
                    </span>
                    {segmentConfig[segment].label}
                  </button>
                ))}
              </div>

              {/* 当前播放 */}
              <div className="p-4" role="tabpanel" id={`panel-${currentSegment}`}>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: playerState === 'playing' ? 360 : 0 }}
                    transition={{
                      duration: 3,
                      repeat: playerState === 'playing' ? Number.POSITIVE_INFINITY : 0,
                      ease: 'linear',
                    }}
                    className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center"
                  >
                    <ListMusic className="w-6 h-6 text-gold" aria-hidden="true" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {currentTrack?.title || '选择歌曲'}
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
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                        votedTracks.has(currentTrack.id)
                          ? 'bg-gold/20 text-gold'
                          : 'bg-muted text-muted-foreground hover:bg-gold/10 hover:text-gold'
                      }`}
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
                  <span>{formatDuration(Math.floor(currentTime))}</span>
                  <span>{duration > 0 ? formatDuration(Math.floor(duration)) : '0:00'}</span>
                </div>
                <div
                  className="h-2 bg-muted rounded-full mb-4 overflow-hidden cursor-pointer hover:h-3 transition-all"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="播放进度"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-gold rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* 控制按钮 */}
                <div className="flex items-center justify-center gap-4 mb-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
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
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-gold flex items-center justify-center text-graphite hover:bg-gold/90 transition-colors active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                    aria-label={playerState === 'playing' ? '暂停' : '播放'}
                    aria-pressed={playerState === 'playing'}
                    disabled={playerState === 'error'}
                  >
                    {playerState === 'playing' ? (
                      <Pause className="w-6 h-6" />
                    ) : playerState === 'loading' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Music className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    aria-label="下一首"
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

                {playerState === 'error' && (
                  <p className="text-xs text-red-500 text-center mt-2">音频加载失败，请重新上传</p>
                )}

                {!localAudioUrl && playerState !== 'playing' && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    💡 提示：点击上方按钮上传您喜欢的音乐
                  </p>
                )}
              </div>

              {/* 播放列表 */}
              <div
                className="border-t border-border max-h-40 overflow-y-auto scrollbar-thin"
                role="list"
                aria-label={`${segmentConfig[currentSegment].label}环节播放列表`}
              >
                {currentPlaylist.map((track, index) => (
                  <button
                    key={track.id}
                    role="listitem"
                    onClick={() => setCurrentTrackIndex(index)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors focus:outline-none focus-visible:bg-gold/10 ${
                      track.id === currentTrack?.id ? 'bg-gold/10' : ''
                    }`}
                    aria-current={track.id === currentTrack?.id ? 'true' : undefined}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-gold text-graphite' : 'bg-muted text-muted-foreground'
                      }`}
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1 text-left min-w-0">
                      <p
                        className={`text-sm truncate ${
                          track.id === currentTrack?.id
                            ? 'text-gold font-medium'
                            : 'text-foreground'
                        }`}
                      >
                        {track.title}
                        <span className="ml-1 text-xs">{moodEmojis[track.mood]}</span>
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {track.artist} · {formatDuration(track.duration)}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Heart
                        className={`w-3 h-3 ${
                          votedTracks.has(track.id) ? 'fill-gold text-gold' : ''
                        }`}
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
