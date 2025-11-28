/**
 * @file 音乐播放器测试页面
 * @description 用于测试新音乐播放器组件功能和兼容性
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import { Metadata } from 'next'
import WeddingMusicPlayerClient from '@/components/client/wedding-music-player-client'

/**
 * 页面元数据配置
 */
export const metadata: Metadata = {
  title: '音乐播放器测试',
  description: '测试婚礼音乐播放器新组件',
}

/**
 * 音乐播放器测试页面
 */
export default function MusicPlayerTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gold/5 p-6">
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">音乐播放器测试</h1>
        <p className="text-muted-foreground">
          这是新音乐播放器组件的测试页面。您可以测试播放控制、音量调节、曲目切换和文件上传等功能。
        </p>
      </header>

      <main className="max-w-3xl mx-auto bg-card rounded-xl shadow-md p-6 border border-border">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">功能测试</h2>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium text-foreground mb-2">测试要点</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>点击迷你播放器展开完整控制界面</li>
                <li>测试播放/暂停/上一首/下一首功能</li>
                <li>调整音量和拖动进度条</li>
                <li>切换不同婚礼环节的播放列表</li>
                <li>测试音乐投票功能</li>
                <li>尝试上传本地音频文件</li>
                <li>检查各种错误状态的处理</li>
              </ul>
            </div>

            <div className="p-4 bg-gold/10 rounded-lg text-sm">
              <h3 className="font-medium text-foreground mb-2">路径处理测试</h3>
              <p className="text-muted-foreground">
                新播放器内置了改进的URL规范化处理，能够正确处理相对路径、中文字符路径和特殊字符。
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg text-sm">
              <h3 className="font-medium text-foreground mb-2">错误处理测试</h3>
              <p className="text-muted-foreground">
                尝试使用无效的音频文件或中断网络连接，测试播放器的错误恢复能力。
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">播放器实例</h2>
          <p className="text-sm text-muted-foreground mb-4">
            播放器会显示在页面右下角。点击音乐图标展开控制界面。
          </p>

          {/* 放置新的音乐播放器组件（客户端包装器） */}
          <WeddingMusicPlayerClient />
        </div>
      </main>

      <footer className="max-w-3xl mx-auto mt-12 pt-6 border-t border-border text-sm text-muted-foreground text-center">
        <p>音乐播放器测试页面 &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
