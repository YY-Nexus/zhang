"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Music, Play, Pause, SkipBack, SkipForward, Heart, ThumbsUp, Volume2 } from "@/components/icons"
import { Button } from "@/components/ui/button"

const playlists = {
  entrance: {
    label: "进场",
    emoji: "🎊",
    tracks: [
      { id: 1, title: "今天你要嫁给我", artist: "陶喆 & 蔡依林", votes: 42 },
      { id: 2, title: "最浪漫的事", artist: "赵咏华", votes: 38 },
      { id: 3, title: "爱很简单", artist: "陶喆", votes: 25 },
    ],
  },
  tea: {
    label: "敬茶",
    emoji: "🍵",
    tracks: [
      { id: 4, title: "父亲", artist: "筷子兄弟", votes: 56 },
      { id: 5, title: "母亲", artist: "阎维文", votes: 48 },
      { id: 6, title: "时间都去哪儿了", artist: "王铮亮", votes: 35 },
    ],
  },
  dinner: {
    label: "用餐",
    emoji: "🍽️",
    tracks: [
      { id: 7, title: "恭喜发财", artist: "刘德华", votes: 62 },
      { id: 8, title: "好日子", artist: "宋祖英", votes: 45 },
      { id: 9, title: "欢乐中国年", artist: "群星", votes: 38 },
    ],
  },
  farewell: {
    label: "送客",
    emoji: "👋",
    tracks: [
      { id: 10, title: "难忘今宵", artist: "李谷一", votes: 72 },
      { id: 11, title: "朋友", artist: "周华健", votes: 58 },
      { id: 12, title: "祝福", artist: "张学友", votes: 44 },
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
            <Music className="w-8 h-8 text-gold" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate">{playlist.tracks[currentTrack]?.title}</h4>
            <p className="text-sm text-muted-foreground truncate">{playlist.tracks[currentTrack]?.artist}</p>
          </div>
          <Volume2 className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* 进度条 */}
        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden mb-4">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gold rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: isPlaying ? "100%" : "35%" }}
            transition={{ duration: isPlaying ? 180 : 0, ease: "linear" }}
          />
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentTrack((prev) => Math.max(0, prev - 1))}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-gold text-graphite flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
          <button
            onClick={() => setCurrentTrack((prev) => Math.min(playlist.tracks.length - 1, prev + 1))}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 投票列表 */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <ThumbsUp className="w-4 h-4" />
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
                  <Heart className={`w-4 h-4 mr-1 ${votedTracks.has(track.id) ? "fill-current" : ""}`} />
                  {track.votes}
                </Button>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  )
}
