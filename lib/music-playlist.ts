/**
 * 婚礼音乐播放列表
 * 按照婚礼基本信息文档要求配置的完整音乐清单
 * 默认自动播放全歌单循环
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
  // 用餐曲目（dining）- 7首
  // ============================================
  {
    id: 'dining-001',
    title: '月亮代表我的心',
    artist: '邓丽君',
    segment: 'dining',
    mood: 'romantic',
    duration: 260,
    priority: 10,
    votes: 0,
    audioUrl: '/MP4/dining/邓丽君 - 月亮代表我的心.mp3',
  },
  {
    id: 'dining-002',
    title: '甜蜜蜜',
    artist: '邓丽君',
    segment: 'dining',
    mood: 'romantic',
    duration: 245,
    priority: 9,
    votes: 0,
    audioUrl: '/MP4/dining/邓丽君 - 甜蜜蜜.mp3',
  },
  {
    id: 'dining-003',
    title: '我只在乎你',
    artist: '邓丽君',
    segment: 'dining',
    mood: 'romantic',
    duration: 275,
    priority: 8,
    votes: 0,
    audioUrl: '/MP4/dining/邓丽君 - 我只在乎你.mp3',
  },
  {
    id: 'dining-004',
    title: '忘了曾经忘了累',
    artist: '沫言',
    segment: 'dining',
    mood: 'peaceful',
    duration: 218,
    priority: 7,
    votes: 0,
    audioUrl: '/MP4/dining/沫言 - 忘了曾经忘了累.mp3',
  },
  {
    id: 'dining-005',
    title: '浮生物语',
    artist: '沫言',
    segment: 'dining',
    mood: 'peaceful',
    duration: 204,
    priority: 6,
    votes: 0,
    audioUrl: '/MP4/dining/沫言 - 浮生物语.mp3',
  },
  {
    id: 'dining-006',
    title: '告白气球',
    artist: '周杰伦',
    segment: 'dining',
    mood: 'joyful',
    duration: 225,
    priority: 5,
    votes: 0,
    audioUrl: '/MP4/dining/周杰伦 - 告白气球.mp3',
  },
  {
    id: 'dining-007',
    title: '小幸运',
    artist: '田馥甄',
    segment: 'dining',
    mood: 'warm',
    duration: 250,
    priority: 4,
    votes: 0,
    audioUrl: '/MP4/dining/田馥甄 - 小幸运.mp3',
  },

  // ============================================
  // 进场曲目（entrance）- 5首
  // ============================================
  {
    id: 'entrance-001',
    title: '给你们',
    artist: '沫言',
    segment: 'entrance',
    mood: 'romantic',
    duration: 295,
    priority: 10,
    votes: 0,
    audioUrl: '/MP4/entrance/沫言 - 给你们.mp3', // 注意：文件名中的中文字符需要确保与实际文件系统匹配
  },
  {
    id: 'entrance-002',
    title: '幸福的脸',
    artist: '沫语',
    segment: 'entrance',
    mood: 'joyful',
    duration: 232,
    priority: 9,
    votes: 0,
    audioUrl: '/MP4/entrance/沫语 - 幸福的脸.mp3', // 注意：文件名中的中文字符需要确保与实际文件系统匹配
  },
  {
    id: 'entrance-003',
    title: '只有你',
    artist: '沫言',
    segment: 'entrance',
    mood: 'romantic',
    duration: 276,
    priority: 8,
    votes: 0,
    audioUrl: '/MP4/entrance/沫言 - 只有你.mp3', // 注意：文件名中的中文字符需要确保与实际文件系统匹配
  },
  {
    id: 'entrance-004',
    title: '今天你要嫁给我',
    artist: '沫言',
    segment: 'entrance',
    mood: 'joyful',
    duration: 268,
    priority: 7,
    votes: 0,
    audioUrl: '/MP4/entrance/沫言 - 今天你要嫁给我.mp3', // 注意：文件名中的中文字符需要确保与实际文件系统匹配
  },
  {
    id: 'entrance-005',
    title: '爱你一万年',
    artist: '沫语',
    segment: 'entrance',
    mood: 'romantic',
    duration: 248,
    priority: 6,
    votes: 0,
    audioUrl: '/MP4/entrance/沫语 - 爱你一万年.mp3', // 注意：文件名中的中文字符需要确保与实际文件系统匹配
  },

  // ============================================
  // 送客曲目（farewell）- 5首
  // ============================================
  {
    id: 'farewell-001',
    title: '难忘今宵',
    artist: '李谷一',
    segment: 'farewell',
    mood: 'festive',
    duration: 210,
    priority: 10,
    votes: 0,
    audioUrl: '/MP4/farewell/李谷一 - 难忘今宵.mp3',
  },
  {
    id: 'farewell-002',
    title: '朋友',
    artist: '周华健',
    segment: 'farewell',
    mood: 'warm',
    duration: 250,
    priority: 9,
    votes: 0,
    audioUrl: '/MP4/farewell/周华健 - 朋友.mp3',
  },
  {
    id: 'farewell-003',
    title: '明天会更好',
    artist: '群星',
    segment: 'farewell',
    mood: 'festive',
    duration: 270,
    priority: 8,
    votes: 0,
    audioUrl: '/MP4/farewell/华语群星 - 明天会更好.mp3', // 注意：实际文件名是"华语群星"，不是"群星"
  },
  {
    id: 'farewell-004',
    title: '祝福',
    artist: '张学友',
    segment: 'farewell',
    mood: 'warm',
    duration: 280,
    priority: 7,
    votes: 0,
    audioUrl: '/MP4/farewell/张学友 - 祝福.mp3',
  },
  {
    id: 'farewell-005',
    title: '昨日的酒',
    artist: '沫言',
    segment: 'farewell',
    mood: 'warm',
    duration: 260,
    priority: 6,
    votes: 0,
    audioUrl: '/MP4/farewell/沫言 - 昨日的酒.mp3',
  },

  // ============================================
  // 敬茶曲目（tea）- 5首
  // ============================================
  {
    id: 'tea-001',
    title: '父亲',
    artist: '筷子兄弟',
    segment: 'tea',
    mood: 'warm',
    duration: 240,
    priority: 10,
    votes: 0,
    audioUrl: '/MP4/tea/筷子兄弟 - 父亲.mp3',
  },
  {
    id: 'tea-002',
    title: '感恩的心',
    artist: '欧阳菲菲',
    segment: 'tea',
    mood: 'warm',
    duration: 260,
    priority: 9,
    votes: 0,
    audioUrl: '/MP4/tea/欧阳菲菲 - 感恩的心.mp3',
  },
  {
    id: 'tea-003',
    title: '母亲',
    artist: '阎维文',
    segment: 'tea',
    mood: 'warm',
    duration: 255,
    priority: 8,
    votes: 0,
    audioUrl: '/MP4/tea/阎维文 - 母亲.mp3',
  },
  {
    id: 'tea-004',
    title: '听妈妈的话',
    artist: '周杰伦',
    segment: 'tea',
    mood: 'joyful',
    duration: 245,
    priority: 7,
    votes: 0,
    audioUrl: '/MP4/tea/周杰伦 - 听妈妈的话.mp3',
  },
  {
    id: 'tea-005',
    title: '时间都去哪了',
    artist: '沫言',
    segment: 'tea',
    mood: 'warm',
    duration: 230,
    priority: 6,
    votes: 0,
    audioUrl: '/MP4/tea/沫语 - 时间都去哪了.mp3',
  }
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
