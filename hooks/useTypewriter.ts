/**
 * 打字机效果 Hook
 * 用于AI对话的打字机动画
 */

import { useState, useEffect } from "react"

interface UseTypewriterOptions {
  text: string
  speed?: number // 每个字符的延迟（毫秒）
  delay?: number // 开始前的延迟（毫秒）
  onComplete?: () => void
}

export function useTypewriter({
  text,
  speed = 50,
  delay = 0,
  onComplete,
}: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // 重置状态
    setDisplayedText("")
    setCurrentIndex(0)
    setIsTyping(false)

    if (!text) return

    // 延迟后开始打字
    const startTimer = setTimeout(() => {
      setIsTyping(true)
    }, delay)

    return () => clearTimeout(startTimer)
  }, [text, delay])

  useEffect(() => {
    if (!isTyping || currentIndex >= text.length) {
      if (currentIndex >= text.length && isTyping) {
        setIsTyping(false)
        onComplete?.()
      }
      return
    }

    const timer = setTimeout(() => {
      setDisplayedText((prev) => prev + text[currentIndex])
      setCurrentIndex((prev) => prev + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [isTyping, currentIndex, text, speed, onComplete])

  return {
    displayedText,
    isTyping,
    isComplete: currentIndex >= text.length,
  }
}

