/**
 * WebSocket 客户端实现
 * 支持自动重连、心跳保活、降级轮询
 */

import type {
  WSMessageType,
  WSPayload,
  VoteUpdate,
  SendMessageResult,
  VoteResult,
  OnlineListResult,
  PlaybackState,
  SyncResult,
  DegradationConfig,
} from "./websocket-architecture"

// 默认配置
const DEFAULT_CONFIG: DegradationConfig = {
  websocket: {
    maxRetries: 3,
    retryInterval: 5000,
    heartbeatInterval: 30000,
    reconnectBackoff: "exponential",
  },
  polling: {
    enabled: true,
    baseInterval: 2000,
    maxInterval: 10000,
    adaptiveInterval: true,
  },
  voting: {
    userRateLimit: 5,
    globalRateLimit: 1000,
    batchWriteInterval: 5000,
    batchWriteThreshold: 100,
  },
  broadcast: {
    mergeWindow: 100,
    maxBatchSize: 50,
    likeNotifyDelay: 500,
  },
}

type ConnectionState = "disconnected" | "connecting" | "connected" | "degraded"

export class WeddingWebSocketClient {
  private ws: WebSocket | null = null
  private config: DegradationConfig
  private state: ConnectionState = "disconnected"
  private retryCount = 0
  private heartbeatTimer: NodeJS.Timeout | null = null
  private pollingTimer: NodeJS.Timeout | null = null
  private messageQueue: WSPayload[] = []
  private listeners: Map<WSMessageType, Set<(data: unknown) => void>> = new Map()
  private guestId: string
  private guestName: string

  constructor(guestId: string, guestName: string, config?: Partial<DegradationConfig>) {
    this.guestId = guestId
    this.guestName = guestName
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  // ============================================================
  // 连接管理
  // ============================================================

  async connect(url: string): Promise<void> {
    if (this.state === "connected") return

    this.state = "connecting"

    try {
      await this.initWebSocket(url)
    } catch (error) {
      console.error("[WS] 连接失败，尝试降级", error)
      this.handleDegradation(url)
    }
  }

  private initWebSocket(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        this.state = "connected"
        this.retryCount = 0
        this.startHeartbeat()
        this.flushQueue()
        this.emit("guest:join", { guestId: this.guestId, guestName: this.guestName })
        resolve()
      }

      this.ws.onmessage = (event) => {
        try {
          const payload: WSPayload = JSON.parse(event.data)
          this.handleMessage(payload)
        } catch (e) {
          console.error("[WS] 消息解析失败", e)
        }
      }

      this.ws.onclose = () => {
        this.state = "disconnected"
        this.stopHeartbeat()
        this.handleReconnect(url)
      }

      this.ws.onerror = (error) => {
        console.error("[WS] 连接错误", error)
        reject(error)
      }
    })
  }

  private handleReconnect(url: string): void {
    if (this.retryCount >= this.config.websocket.maxRetries) {
      this.handleDegradation(url)
      return
    }

    const delay = this.config.websocket.retryInterval * Math.pow(2, this.retryCount)
    this.retryCount++

    console.log(`[WS] ${delay}ms 后重连 (第 ${this.retryCount} 次)`)

    setTimeout(() => {
      this.connect(url)
    }, delay)
  }

  private handleDegradation(url: string): void {
    if (!this.config.polling.enabled) return

    console.log("[WS] 降级到 HTTP 轮询模式")
    this.state = "degraded"

    // 启动轮询
    this.startPolling(url.replace("wss://", "https://").replace("ws://", "http://"))
  }

  // ============================================================
  // 心跳保活
  // ============================================================

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping", timestamp: Date.now() }))
      }
    }, this.config.websocket.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  // ============================================================
  // 降级轮询
  // ============================================================

  private startPolling(baseUrl: string): void {
    const poll = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/wedding/poll`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guestId: this.guestId,
            lastTimestamp: Date.now() - this.config.polling.baseInterval,
          }),
        })

        const data = await response.json()
        data.messages?.forEach((msg: WSPayload) => this.handleMessage(msg))
      } catch (error) {
        console.error("[Polling] 轮询失败", error)
      }
    }

    this.pollingTimer = setInterval(poll, this.config.polling.baseInterval)
    poll() // 立即执行一次
  }

  // ============================================================
  // 消息处理
  // ============================================================

  private handleMessage(payload: WSPayload): void {
    const callbacks = this.listeners.get(payload.type)
    if (callbacks) {
      callbacks.forEach((cb) => cb(payload.data))
    }
  }

  private emit(type: WSMessageType, data: unknown): void {
    const payload: WSPayload = {
      type,
      data,
      timestamp: Date.now(),
      requestId: crypto.randomUUID(),
    }

    if (this.state === "connected" && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload))
    } else if (this.state === "degraded") {
      // 降级模式：通过 HTTP POST 发送
      fetch("/api/wedding/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(console.error)
    } else {
      // 离线：加入队列
      this.messageQueue.push(payload)
    }
  }

  private flushQueue(): void {
    while (this.messageQueue.length > 0) {
      const payload = this.messageQueue.shift()
      if (payload && this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(payload))
      }
    }
  }

  // ============================================================
  // 公共 API 实现
  // ============================================================

  /**
   * sendMessage - 发送留言
   */
  async sendMessage(content: string): Promise<SendMessageResult> {
    return new Promise((resolve) => {
      const requestId = crypto.randomUUID()

      // 监听响应
      const handler = (data: SendMessageResult & { requestId?: string }) => {
        if (data.requestId === requestId) {
          this.off("message:received", handler)
          resolve(data)
        }
      }
      this.on("message:received", handler)

      // 发送消息
      this.emit("message:send", {
        guestId: this.guestId,
        guestName: this.guestName,
        content,
        requestId,
      })

      // 超时处理
      setTimeout(() => {
        this.off("message:received", handler)
        resolve({
          success: false,
          error: { code: "CONNECTION_ERROR", message: "请求超时" },
        })
      }, 10000)
    })
  }

  /**
   * subscribeVotes - 订阅投票更新
   */
  subscribeVotes(callback: (update: VoteUpdate) => void): () => void {
    this.on("vote:update", callback as (data: unknown) => void)
    return () => this.off("vote:update", callback as (data: unknown) => void)
  }

  /**
   * voteTrack - 投票
   */
  async voteTrack(trackId: string): Promise<VoteResult> {
    return new Promise((resolve) => {
      const requestId = crypto.randomUUID()

      const handler = (data: VoteResult & { requestId?: string }) => {
        if (data.requestId === requestId) {
          this.off("vote:update", handler)
          resolve(data)
        }
      }
      this.on("vote:update", handler)

      this.emit("vote:cast", {
        trackId,
        guestId: this.guestId,
        requestId,
      })

      setTimeout(() => {
        this.off("vote:update", handler)
        resolve({
          success: false,
          trackId,
          currentVotes: 0,
          error: { code: "CONNECTION_ERROR", message: "请求超时" },
        })
      }, 5000)
    })
  }

  /**
   * getOnlineList - 获取在线列表
   */
  async getOnlineList(): Promise<OnlineListResult> {
    return new Promise((resolve) => {
      const handler = (data: OnlineListResult) => {
        this.off("guest:list", handler)
        resolve(data)
      }
      this.on("guest:list", handler)

      this.emit("sync:request", { type: "guest:list" })

      setTimeout(() => {
        this.off("guest:list", handler)
        resolve({ guests: [], total: 0, lastUpdated: Date.now() })
      }, 5000)
    })
  }

  /**
   * syncPosition - 同步播放位置
   */
  async syncPosition(sessionId: string, state?: Partial<PlaybackState>): Promise<SyncResult> {
    return new Promise((resolve) => {
      const handler = (data: SyncResult) => {
        this.off("sync:response", handler)
        resolve(data)
      }
      this.on("sync:response", handler)

      this.emit("sync:request", { sessionId, state })

      setTimeout(() => {
        this.off("sync:response", handler)
        resolve({
          success: false,
          sessionId,
          currentState: {} as PlaybackState,
          connectedDevices: 0,
          isMaster: false,
        })
      }, 5000)
    })
  }

  // ============================================================
  // 事件监听
  // ============================================================

  on(type: WSMessageType, callback: (data: unknown) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set())
    }
    this.listeners.get(type)!.add(callback)
  }

  off(type: WSMessageType, callback: (data: unknown) => void): void {
    this.listeners.get(type)?.delete(callback)
  }

  // ============================================================
  // 清理
  // ============================================================

  disconnect(): void {
    this.stopHeartbeat()
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer)
    }
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.state = "disconnected"
  }

  getState(): ConnectionState {
    return this.state
  }
}

// 单例导出
let clientInstance: WeddingWebSocketClient | null = null

export function getWebSocketClient(guestId: string, guestName: string): WeddingWebSocketClient {
  if (!clientInstance) {
    clientInstance = new WeddingWebSocketClient(guestId, guestName)
  }
  return clientInstance
}
