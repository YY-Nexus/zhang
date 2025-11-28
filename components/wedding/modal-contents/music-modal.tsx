"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

// 定义音乐播放列表类型
type Track = {
  id: number
  title: string
  artist: string
  votes: number
  file: string
}

type Playlist = {
  label: string
  emoji: string
  tracks: Track[]
}

type PlaylistsType = {
  [key: string]: Playlist
}

// 临时图标组件作为替代
const Icon = ({ name, style }: { name: string; style?: React.CSSProperties }) => {
  return <span style={style}>{name}</span>
}

// 定义播放列表数据并添加类型注解
const playlists: PlaylistsType = {
  entrance: {
    label: "进场",
    emoji: "🎊",
    tracks: [
      { id: 1, title: "今天你要嫁给我", artist: "沫言", votes: 42, file: "/music/entrance/沫言 - 今天你要嫁给我.mp3" },
      { id: 2, title: "只有你", artist: "沫言", votes: 38, file: "/music/entrance/沫言 - 只有你.mp3" },
      { id: 3, title: "给你们", artist: "沫言", votes: 25, file: "/music/entrance/沫言 - 给你们.mp3" },
      { id: 4, title: "幸福的脸", artist: "沫语", votes: 20, file: "/music/entrance/沫语 - 幸福的脸.mp3" },
      { id: 5, title: "爱你一万年", artist: "沫语", votes: 15, file: "/music/entrance/沫语 - 爱你一万年.mp3" },
    ],
  },
  tea: {
    label: "敬茶",
    emoji: "🍵",
    tracks: [
      { id: 6, title: "父亲", artist: "筷子兄弟", votes: 56, file: "/music/tea/筷子兄弟 - 父亲.mp3" },
      { id: 7, title: "母亲", artist: "阎维文", votes: 48, file: "/music/tea/阎维文 - 母亲.mp3" },
      { id: 8, title: "时间都去哪了", artist: "沫语", votes: 35, file: "/music/tea/沫语 - 时间都去哪了.mp3" },
      { id: 9, title: "听妈妈的话", artist: "周杰伦", votes: 30, file: "/music/tea/周杰伦 - 听妈妈的话.mp3" },
      { id: 10, title: "感恩的心", artist: "欧阳菲菲", votes: 25, file: "/music/tea/欧阳菲菲 - 感恩的心.mp3" },
    ],
  },
  dinner: {
    label: "用餐",
    emoji: "🍽️",
    tracks: [
      { id: 11, title: "告白气球", artist: "周杰伦", votes: 62, file: "/music/dining/周杰伦 - 告白气球.mp3" },
      { id: 12, title: "小幸运", artist: "田馥甄", votes: 45, file: "/music/dining/田馥甄 - 小幸运.mp3" },
      { id: 13, title: "我只在乎你", artist: "邓丽君", votes: 40, file: "/music/dining/邓丽君 - 我只在乎你.mp3" },
      { id: 14, title: "月亮代表我的心", artist: "邓丽君", votes: 35, file: "/music/dining/邓丽君 - 月亮代表我的心.mp3" },
      { id: 15, title: "甜蜜蜜", artist: "邓丽君", votes: 30, file: "/music/dining/邓丽君 - 甜蜜蜜.mp3" },
      { id: 16, title: "忘了曾经忘了累", artist: "沫言", votes: 25, file: "/music/dining/沫言 - 忘了曾经忘了累.mp3" },
      { id: 17, title: "浮生物语", artist: "沫言", votes: 20, file: "/music/dining/沫言 - 浮生物语.mp3" },
    ],
  },
  farewell: {
    label: "送客",
    emoji: "👋",
    tracks: [
      { id: 18, title: "难忘今宵", artist: "李谷一", votes: 72, file: "/music/farewell/李谷一 - 难忘今宵.mp3" },
      { id: 19, title: "朋友", artist: "周华健", votes: 58, file: "/music/farewell/周华健 - 朋友.mp3" },
      { id: 20, title: "祝福", artist: "张学友", votes: 44, file: "/music/farewell/张学友 - 祝福.mp3" },
      { id: 21, title: "明天会更好", artist: "华语群星", votes: 35, file: "/music/farewell/华语群星 - 明天会更好.mp3" },
      { id: 22, title: "昨日的酒", artist: "沫言", votes: 30, file: "/music/farewell/沫言 - 昨日的酒.mp3" },
    ],
  },
}

type Segment = keyof typeof playlists

export default function MusicModalContent() {
  const [currentSegment, setCurrentSegment] = useState<Segment>("entrance")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [votedTracks, setVotedTracks] = useState<Set<number>>(new Set())
  const [tracksData, setTracksData] = useState(playlists)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [progress, setProgress] = useState(0)

  const playlist = tracksData[currentSegment]

  const handleVote = (trackId: number) => {
    if (votedTracks.has(trackId)) return

    setVotedTracks((prev) => new Set([...prev, trackId]))
    setTracksData((prev) => ({
      ...prev,
      [currentSegment]: {
        ...prev[currentSegment],
        tracks: prev[currentSegment].tracks.map((t) => (t.id === trackId ? { ...t, votes: t.votes + 1 } : t)),
      },
    }))
  }

  // 处理音频播放逻辑
  useEffect(() => {
    // 创建新的音频元素
    const newAudio = new Audio()
    
    // 监听时间更新事件
    const handleTimeUpdate = () => {
      if (newAudio.duration > 0) {
        setProgress((newAudio.currentTime / newAudio.duration) * 100)
      }
    }
    
    // 监听播放结束事件
    const handleEnded = () => {
      // 播放下一首曲目
      setCurrentTrack((prev) => {
        if (prev < playlist.tracks.length - 1) {
          return prev + 1
        }
        // 如果是最后一首，循环回第一首
        return 0
      })
    }
    
    newAudio.addEventListener('timeupdate', handleTimeUpdate)
    newAudio.addEventListener('ended', handleEnded)
    
    setAudio(newAudio)

    // 清理函数
    return () => {
      newAudio.removeEventListener('timeupdate', handleTimeUpdate)
      newAudio.removeEventListener('ended', handleEnded)
      newAudio.pause()
      newAudio.src = ''
    }
  }, [playlist.tracks.length])

  // 当曲目变化时更新音频源
  useEffect(() => {
    if (!audio) return

    const currentSong = playlist.tracks[currentTrack]
    if (!currentSong || !currentSong.file) return

    // 重置进度
    setProgress(0)
    
    // 暂停当前播放
    audio.pause()
    // 更新音频源
    audio.src = currentSong.file
    
    // 如果之前是播放状态，自动开始播放新曲目
    if (isPlaying) {
      audio.play().catch(error => {
        console.error('播放失败:', error)
        setIsPlaying(false)
      })
    }
  }, [currentTrack, currentSegment, audio, isPlaying, playlist.tracks])

  // 控制播放/暂停
  useEffect(() => {
    if (!audio) return

    if (isPlaying) {
      audio.play().catch(error => {
        console.error('播放失败:', error)
        setIsPlaying(false)
      })
    } else {
      audio.pause()
    }
  }, [isPlaying, audio])

  return (
    <div className="p-4 space-y-4">
      {/* 环节切换 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(Object.entries(playlists) as [Segment, typeof playlists.entrance][]).map(([key, { label, emoji }]) => (
          <button
            key={key}
            onClick={() => {
              setCurrentSegment(key)
              setCurrentTrack(0)
            }}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
              transition-all duration-300
              ${
                currentSegment === key
                  ? "bg-gold text-graphite shadow-lg shadow-gold/20"
                  : "bg-muted text-muted-foreground hover:bg-gold/10"
              }
            `}
          >
            <span>{emoji}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* 当前播放 */}
      <div className="bg-gold/5 rounded-xl p-4">
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 3, repeat: isPlaying ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
            className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center"
          >
            <Icon name="Music" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate">{playlist.tracks[currentTrack]?.title}</h4>
            <p className="text-sm text-muted-foreground truncate">{playlist.tracks[currentTrack]?.artist}</p>
          </div>
          <Icon name="Volume2" />
        </div>

        {/* 进度条 */}
        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden mb-4 cursor-pointer" onClick={(e) => {
          if (!audio) return
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          const percentage = x / rect.width
          audio.currentTime = audio.duration * percentage
        }}>
          <motion.div
            className="absolute inset-y-0 left-0 bg-gold rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentTrack((prev) => Math.max(0, prev - 1))}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <Icon name="SkipBack" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-gold text-graphite flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Icon name="Pause" /> : <Icon name="Play" />}
          </button>
          <button
            onClick={() => setCurrentTrack((prev) => Math.min(playlist.tracks.length - 1, prev + 1))}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <Icon name="SkipForward" />
          </button>
        </div>
      </div>

      {/* 投票列表 */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Icon name="ThumbsUp" />
          来宾投票榜
        </h4>
        <div className="space-y-2">
          {playlist.tracks
            .sort((a, b) => b.votes - a.votes)
            .map((track, index) => (
              <motion.div
                key={track.id}
                layout
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-colors
                  ${
                    currentTrack === playlist.tracks.findIndex((t) => t.id === track.id)
                      ? "bg-gold/10 border border-gold/30"
                      : "bg-muted/50 hover:bg-muted"
                  }
                `}
              >
                <span
                  className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${index === 0 ? "bg-gold text-graphite" : "bg-muted-foreground/20 text-muted-foreground"}
                `}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{track.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
                <Button
                  size="sm"
                  variant={votedTracks.has(track.id) ? "default" : "outline"}
                  onClick={() => handleVote(track.id)}
                  disabled={votedTracks.has(track.id)}
                  className={votedTracks.has(track.id) ? "bg-gold text-graphite" : ""}
                >
                  <Icon name="Heart" />
                  {track.votes}
                </Button>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  )
}

