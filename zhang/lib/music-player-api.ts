/**
 * 婚礼音乐播放器 API 接口定义
 * 支持分段播放、来宾投票、跨设备同步
 */

// ============================================
// 类型定义
// ============================================

export interface Track {
  id: string
  title: string
  artist: string
  duration: number // 秒
  segment: MusicSegment
  audioUrl?: string
  votes: number
  coverUrl?: string
}

export type MusicSegment = "entrance" | "tea" | "dinner" | "farewell"

export interface Playlist {
  segment: MusicSegment
  label: string
  emoji: string
  tracks: Track[]
}

export interface PlaybackState {
  trackId: string | null
  position: number // 秒
  isPlaying: boolean
  volume: number // 0-1
  segment: MusicSegment
  timestamp: number // Unix timestamp
}

export interface VoteResult {
  success: boolean
  trackId: string
  newVoteCount: number
  guestId: string
}

export interface SyncResult {
  sessionId: string
  state: PlaybackState
  connectedDevices: number
}

// ============================================
// API 函数签名
// ============================================

/**
 * 获取指定环节的播放列表
 * @param segment - 婚礼环节 (entrance/tea/dinner/farewell)
 * @returns Promise<Playlist> - 该环节的完整播放列表
 * @example
 * const playlist = await getPlaylist("entrance")
 * console.log(playlist.tracks) // 进场音乐列表
 */
export async function getPlaylist(segment?: MusicSegment): Promise<Playlist | Playlist[]> {
  // 实际实现会调用后端 API
  const playlists: Record<MusicSegment, Playlist> = {
    entrance: {
      segment: "entrance",
      label: "进场",
      emoji: "🎊",
      tracks: [
        { id: "1", title: "今天你要嫁给我", artist: "陶喆 & 蔡依林", duration: 272, segment: "entrance", votes: 42 },
        { id: "2", title: "最浪漫的事", artist: "赵咏华", duration: 258, segment: "entrance", votes: 38 },
        { id: "3", title: "爱很简单", artist: "陶喆", duration: 295, segment: "entrance", votes: 25 },
      ],
    },
    tea: {
      segment: "tea",
      label: "敬茶",
      emoji: "🍵",
      tracks: [
        { id: "4", title: "父亲", artist: "筷子兄弟", duration: 312, segment: "tea", votes: 56 },
        { id: "5", title: "母亲", artist: "阎维文", duration: 285, segment: "tea", votes: 48 },
        { id: "6", title: "时间都去哪儿了", artist: "王铮亮", duration: 268, segment: "tea", votes: 35 },
      ],
    },
    dinner: {
      segment: "dinner",
      label: "用餐",
      emoji: "🍽️",
      tracks: [
        { id: "7", title: "恭喜发财", artist: "刘德华", duration: 208, segment: "dinner", votes: 62 },
        { id: "8", title: "好日子", artist: "宋祖英", duration: 255, segment: "dinner", votes: 45 },
        { id: "9", title: "欢乐中国年", artist: "群星", duration: 232, segment: "dinner", votes: 38 },
      ],
    },
    farewell: {
      segment: "farewell",
      label: "送客",
      emoji: "👋",
      tracks: [
        { id: "10", title: "难忘今宵", artist: "李谷一", duration: 242, segment: "farewell", votes: 72 },
        { id: "11", title: "朋友", artist: "周华健", duration: 298, segment: "farewell", votes: 58 },
        { id: "12", title: "祝福", artist: "张学友", duration: 264, segment: "farewell", votes: 44 },
      ],
    },
  }

  if (segment) {
    return playlists[segment]
  }
  return Object.values(playlists)
}

/**
 * 来宾为歌曲投票
 * @param trackId - 歌曲 ID
 * @param guestId - 来宾 ID (用于防止重复投票)
 * @returns Promise<VoteResult> - 投票结果，包含新的投票数
 * @example
 * const result = await voteTrack("track_001", "guest_abc123")
 * if (result.success) {
 *   console.log(`投票成功！当前票数: ${result.newVoteCount}`)
 * }
 */
export async function voteTrack(trackId: string, guestId: string): Promise<VoteResult> {
  // 实际实现会调用后端 API 并持久化
  // 这里返回模拟数据
  return {
    success: true,
    trackId,
    guestId,
    newVoteCount: Math.floor(Math.random() * 100) + 1,
  }
}

/**
 * 同步播放位置（跨设备同步）
 * @param sessionId - 会话 ID (婚礼唯一标识)
 * @param state - 可选，当前播放状态（发送方提供）
 * @returns Promise<SyncResult> - 同步后的播放状态
 * @example
 * // 作为接收方同步
 * const sync = await syncPosition("wedding_zhangbo_2025")
 * audioRef.current.currentTime = sync.state.position
 *
 * // 作为发送方广播
 * await syncPosition("wedding_zhangbo_2025", currentState)
 */
export async function syncPosition(sessionId: string, state?: Partial<PlaybackState>): Promise<SyncResult> {
  // 实际实现会使用 WebSocket 或 Server-Sent Events
  // 这里返回模拟数据
  return {
    sessionId,
    state: {
      trackId: state?.trackId || "1",
      position: state?.position || 0,
      isPlaying: state?.isPlaying ?? false,
      volume: state?.volume ?? 0.8,
      segment: state?.segment || "entrance",
      timestamp: Date.now(),
    },
    connectedDevices: 3,
  }
}

/**
 * 获取用户音量设置（本地存储）
 * @returns number - 音量值 0-1
 */
export function getStoredVolume(): number {
  if (typeof window === "undefined") return 0.8
  const stored = localStorage.getItem("wedding_music_volume")
  return stored ? Number.parseFloat(stored) : 0.8
}

/**
 * 保存用户音量设置（本地存储）
 * @param volume - 音量值 0-1
 */
export function setStoredVolume(volume: number): void {
  if (typeof window === "undefined") return
  localStorage.setItem("wedding_music_volume", String(volume))
}

// ============================================
// 播放器状态机
// ============================================

export type PlayerState = "idle" | "loading" | "playing" | "paused" | "error"
export type VoteState = "idle" | "voting" | "voted" | "error"
export type SyncState = "disconnected" | "connecting" | "synced" | "broadcasting"

/**
 * 状态机转换规则
 *
 * PlayerState:
 * idle -> loading (播放请求)
 * loading -> playing (加载完成) | error (加载失败)
 * playing -> paused (暂停) | idle (停止) | loading (切换曲目)
 * paused -> playing (继续) | idle (停止) | loading (切换曲目)
 * error -> idle (重试) | loading (切换曲目)
 *
 * VoteState:
 * idle -> voting (提交投票)
 * voting -> voted (投票成功) | error (投票失败)
 * voted -> idle (重置，用于其他歌曲)
 * error -> idle (重试)
 *
 * SyncState:
 * disconnected -> connecting (发起连接)
 * connecting -> synced (连接成功) | disconnected (连接失败)
 * synced -> broadcasting (发送状态) | disconnected (断开)
 * broadcasting -> synced (发送完成) | disconnected (断开)
 */
