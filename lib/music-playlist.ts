/**
 * 中文婚礼曲库（任务卡 04）
 * 20 首曲目清单，按环节标注情绪标签
 */

export type MusicMood = 'romantic' | 'joyful' | 'warm' | 'festive' | 'peaceful'
export type MusicSegment = 'entrance' | 'tea' | 'dining' | 'farewell'

export interface Track {
  id: string
  title: string
  artist: string
  segment: MusicSegment
  mood: MusicMood
  duration: number // 秒
  priority: number // 1-10，越高优先级越高
  votes: number
  audioUrl?: string // 音频文件路径（本地或URL）
}

export const weddingPlaylist: Track[] = [
  // ============================================
  // 进场曲目（entrance）- 5首
  // ============================================
  {
    id: 'entrance-001',
    title: '今天你要嫁给我',
    artist: '沫言（原创）',
    segment: 'entrance',
    mood: 'joyful',
    duration: 268,
    priority: 10,
    votes: 0,
    audioUrl: '/music/entrance/沫言 - 今天你要嫁给我.mp3',
  },
  {
    id: 'entrance-002',
    title: '给你们',
    artist: '沫言（原创）',
    segment: 'entrance',
    mood: 'romantic',
    duration: 295,
    priority: 9,
    votes: 0,
    audioUrl: '/music/entrance/沫言 - 给你们.mp3',
  },
  {
    id: 'entrance-003',
    title: '只有你',
    artist: '沫言（原创）',
    segment: 'entrance',
    mood: 'romantic',
    duration: 276,
    priority: 8,
    votes: 0,
    audioUrl: '/music/entrance/沫言 - 只有你.mp3',
  },
  {
    id: 'entrance-004',
    title: '爱你一万年',
    artist: '沫语（原创）',
    segment: 'entrance',
    mood: 'romantic',
    duration: 248,
    priority: 7,
    votes: 0,
    audioUrl: '/music/entrance/沫语 - 爱你一万年.mp3',
  },
  {
    id: 'entrance-005',
    title: '幸福的脸',
    artist: '沫语（原创）',
    segment: 'entrance',
    mood: 'joyful',
    duration: 232,
    priority: 6,
    votes: 0,
    audioUrl: '/music/entrance/沫语 - 幸福的脸.mp3',
  },

  // ============================================
  // 敬茶曲目（tea）- 5首
  // ============================================
  {
    id: 'tea-001',
    title: '浮生物语',
    artist: '沫言（原创）',
    segment: 'tea',
    mood: 'warm',
    duration: 285,
    priority: 10,
    votes: 0,
    audioUrl: '/music/dining/沫言 - 浮生物语.mp3',
  },
  {
    id: 'tea-002',
    title: '忘了曾经忘了累',
    artist: '沫言（原创）',
    segment: 'tea',
    mood: 'warm',
    duration: 320,
    priority: 9,
    votes: 0,
    audioUrl: '/music/dining/沫言 - 忘了曾经忘了累.mp3',
  },
  {
    id: 'tea-003',
    title: '只有你',
    artist: '沫言（原创）',
    segment: 'tea',
    mood: 'warm',
    duration: 298,
    priority: 8,
    votes: 0,
    audioUrl: '/music/entrance/沫言 - 只有你.mp3',
  },
  {
    id: 'tea-004',
    title: '给你们',
    artist: '沫言（原创）',
    segment: 'tea',
    mood: 'warm',
    duration: 276,
    priority: 7,
    votes: 0,
    audioUrl: '/music/entrance/沫言 - 给你们.mp3',
  },
  {
    id: 'tea-005',
    title: '今天你要嫁给我',
    artist: '沫言（原创）',
    segment: 'tea',
    mood: 'warm',
    priority: 6,
    duration: 312,
    votes: 0,
    audioUrl: '/music/entrance/沫言 - 今天你要嫁给我.mp3',
  },

  // ============================================
  // 用餐曲目（dining）- 6首
  // ============================================
  {
    id: 'dining-001',
    title: '忘了曾经忘了累',
    artist: '沫言（原创）',
    segment: 'dining',
    mood: 'peaceful',
    duration: 218,
    priority: 10,
    votes: 0,
    audioUrl: '/music/dining/沫言 - 忘了曾经忘了累.mp3',
  },
  {
    id: 'dining-002',
    title: '浮生物语',
    artist: '沫言（原创）',
    segment: 'dining',
    mood: 'peaceful',
    duration: 204,
    priority: 9,
    votes: 0,
    audioUrl: '/music/dining/沫言 - 浮生物语.mp3',
  },
  {
    id: 'dining-003',
    title: '只有你',
    artist: '沫言（原创）',
    segment: 'dining',
    mood: 'peaceful',
    duration: 252,
    priority: 8,
    votes: 0,
    audioUrl: '/music/entrance/沫言 - 只有你.mp3',
  },
  {
    id: 'dining-004',
    title: '给你们',
    artist: '沫言（原创）',
    segment: 'dining',
    mood: 'romantic',
    duration: 268,
    priority: 7,
    votes: 0,
    audioUrl: '/music/entrance/沫言 - 给你们.mp3',
  },
  {
    id: 'dining-005',
    title: '幸福的脸',
    artist: '沫语（原创）',
    segment: 'dining',
    mood: 'romantic',
    duration: 293,
    priority: 6,
    votes: 0,
    audioUrl: '/music/entrance/沫语 - 幸福的脸.mp3',
  },
  {
    id: 'dining-006',
    title: '爱你一万年',
    artist: '沫语（原创）',
    segment: 'dining',
    mood: 'joyful',
    duration: 215,
    priority: 5,
    votes: 0,
    audioUrl: '/music/entrance/沫语 - 爱你一万年.mp3',
  },

  // ============================================
  // 送客曲目（farewell）- 4首
  // ============================================
  {
    id: 'farewell-001',
    title: '今天你要嫁给我',
    artist: '沫言（原创）',
    segment: 'farewell',
    mood: 'festive',
    duration: 186,
    priority: 10,
    votes: 0,
    audioUrl: '/music/entrance/沫言 - 今天你要嫁给我.mp3',
  },
  {
    id: 'farewell-002',
    title: '幸福的脸',
    artist: '沫语（原创）',
    segment: 'farewell',
    mood: 'warm',
    duration: 298,
    priority: 9,
    votes: 0,
    audioUrl: '/music/entrance/沫语 - 幸福的脸.mp3',
  },
  {
    id: 'farewell-003',
    title: '爱你一万年',
    artist: '沫语（原创）',
    segment: 'farewell',
    mood: 'joyful',
    duration: 285,
    priority: 8,
    votes: 0,
    audioUrl: '/music/entrance/沫语 - 爱你一万年.mp3',
  },
  {
    id: 'farewell-004',
    title: '浮生物语',
    artist: '沫言（原创）',
    segment: 'farewell',
    mood: 'warm',
    duration: 276,
    priority: 7,
    votes: 0,
    audioUrl: '/music/dining/沫言 - 浮生物语.mp3',
  },
]

// ============================================
// 工具函数
// ============================================

export function getPlaylistBySegment(segment: MusicSegment): Track[] {
  return weddingPlaylist
    .filter(t => t.segment === segment)
    .sort((a, b) => {
      // 先按投票排序，再按优先级
      if (b.votes !== a.votes) return b.votes - a.votes
      return b.priority - a.priority
    })
}

export function getPlaylistByMood(mood: MusicMood): Track[] {
  return weddingPlaylist.filter(t => t.mood === mood)
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const segmentLabels: Record<MusicSegment, string> = {
  entrance: '进场',
  tea: '敬茶',
  dining: '用餐',
  farewell: '送客',
}

export const moodLabels: Record<MusicMood, string> = {
  romantic: '浪漫',
  joyful: '欢快',
  warm: '温馨',
  festive: '喜庆',
  peaceful: '舒缓',
}

export const moodEmojis: Record<MusicMood, string> = {
  romantic: '💕',
  joyful: '🎉',
  warm: '🤗',
  festive: '🎊',
  peaceful: '🎵',
}
