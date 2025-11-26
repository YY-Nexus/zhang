/**
 * 中文婚礼曲库（任务卡 04）
 * 20 首曲目清单，按环节标注情绪标签
 */

export type MusicMood = "romantic" | "joyful" | "warm" | "festive" | "peaceful"
export type MusicSegment = "entrance" | "tea" | "dining" | "farewell"

export interface Track {
  id: string
  title: string
  artist: string
  segment: MusicSegment
  mood: MusicMood
  duration: number // 秒
  priority: number // 1-10，越高优先级越高
  votes: number
}

export const weddingPlaylist: Track[] = [
  // ============================================
  // 进场曲目（entrance）- 5首
  // ============================================
  {
    id: "entrance-001",
    title: "今天你要嫁给我",
    artist: "蔡依林 & 陶喆",
    segment: "entrance",
    mood: "joyful",
    duration: 268,
    priority: 10,
    votes: 0,
  },
  {
    id: "entrance-002",
    title: "给你们",
    artist: "张宇",
    segment: "entrance",
    mood: "romantic",
    duration: 295,
    priority: 9,
    votes: 0,
  },
  {
    id: "entrance-003",
    title: "最浪漫的事",
    artist: "赵咏华",
    segment: "entrance",
    mood: "romantic",
    duration: 276,
    priority: 8,
    votes: 0,
  },
  {
    id: "entrance-004",
    title: "爱你一万年",
    artist: "刘德华",
    segment: "entrance",
    mood: "romantic",
    duration: 248,
    priority: 7,
    votes: 0,
  },
  {
    id: "entrance-005",
    title: "幸福的脸",
    artist: "温岚",
    segment: "entrance",
    mood: "joyful",
    duration: 232,
    priority: 6,
    votes: 0,
  },

  // ============================================
  // 敬茶曲目（tea）- 5首
  // ============================================
  {
    id: "tea-001",
    title: "感恩的心",
    artist: "欧阳菲菲",
    segment: "tea",
    mood: "warm",
    duration: 285,
    priority: 10,
    votes: 0,
  },
  {
    id: "tea-002",
    title: "父亲",
    artist: "筷子兄弟",
    segment: "tea",
    mood: "warm",
    duration: 320,
    priority: 9,
    votes: 0,
  },
  {
    id: "tea-003",
    title: "母亲",
    artist: "阎维文",
    segment: "tea",
    mood: "warm",
    duration: 298,
    priority: 8,
    votes: 0,
  },
  {
    id: "tea-004",
    title: "时间都去哪儿了",
    artist: "王铮亮",
    segment: "tea",
    mood: "warm",
    duration: 276,
    priority: 7,
    votes: 0,
  },
  {
    id: "tea-005",
    title: "听妈妈的话",
    artist: "周杰伦",
    segment: "tea",
    mood: "warm",
    priority: 6,
    duration: 312,
    votes: 0,
  },

  // ============================================
  // 用餐曲目（dining）- 6首
  // ============================================
  {
    id: "dining-001",
    title: "月亮代表我的心",
    artist: "邓丽君",
    segment: "dining",
    mood: "peaceful",
    duration: 218,
    priority: 10,
    votes: 0,
  },
  {
    id: "dining-002",
    title: "甜蜜蜜",
    artist: "邓丽君",
    segment: "dining",
    mood: "peaceful",
    duration: 204,
    priority: 9,
    votes: 0,
  },
  {
    id: "dining-003",
    title: "恰似你的温柔",
    artist: "蔡琴",
    segment: "dining",
    mood: "peaceful",
    duration: 252,
    priority: 8,
    votes: 0,
  },
  {
    id: "dining-004",
    title: "我只在乎你",
    artist: "邓丽君",
    segment: "dining",
    mood: "romantic",
    duration: 268,
    priority: 7,
    votes: 0,
  },
  {
    id: "dining-005",
    title: "小幸运",
    artist: "田馥甄",
    segment: "dining",
    mood: "romantic",
    duration: 293,
    priority: 6,
    votes: 0,
  },
  {
    id: "dining-006",
    title: "告白气球",
    artist: "周杰伦",
    segment: "dining",
    mood: "joyful",
    duration: 215,
    priority: 5,
    votes: 0,
  },

  // ============================================
  // 送客曲目（farewell）- 4首
  // ============================================
  {
    id: "farewell-001",
    title: "难忘今宵",
    artist: "李谷一",
    segment: "farewell",
    mood: "festive",
    duration: 186,
    priority: 10,
    votes: 0,
  },
  {
    id: "farewell-002",
    title: "朋友",
    artist: "周华健",
    segment: "farewell",
    mood: "warm",
    duration: 298,
    priority: 9,
    votes: 0,
  },
  {
    id: "farewell-003",
    title: "明天会更好",
    artist: "群星",
    segment: "farewell",
    mood: "joyful",
    duration: 285,
    priority: 8,
    votes: 0,
  },
  {
    id: "farewell-004",
    title: "祝福",
    artist: "张学友",
    segment: "farewell",
    mood: "warm",
    duration: 276,
    priority: 7,
    votes: 0,
  },
]

// ============================================
// 工具函数
// ============================================

export function getPlaylistBySegment(segment: MusicSegment): Track[] {
  return weddingPlaylist
    .filter((t) => t.segment === segment)
    .sort((a, b) => {
      // 先按投票排序，再按优先级
      if (b.votes !== a.votes) return b.votes - a.votes
      return b.priority - a.priority
    })
}

export function getPlaylistByMood(mood: MusicMood): Track[] {
  return weddingPlaylist.filter((t) => t.mood === mood)
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export const segmentLabels: Record<MusicSegment, string> = {
  entrance: "进场",
  tea: "敬茶",
  dining: "用餐",
  farewell: "送客",
}

export const moodLabels: Record<MusicMood, string> = {
  romantic: "浪漫",
  joyful: "欢快",
  warm: "温馨",
  festive: "喜庆",
  peaceful: "舒缓",
}

export const moodEmojis: Record<MusicMood, string> = {
  romantic: "💕",
  joyful: "🎉",
  warm: "🤗",
  festive: "🎊",
  peaceful: "🎵",
}
