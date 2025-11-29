/**
 * 动效系统规范文档（任务卡 08）
 * 全站动效规范，包含 easing、时长、触发条件与降级策略
 */

// ============================================
// 1. Easing 缓动函数库
// ============================================

export const easings = {
  // 标准缓动
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  // 强调进入
  emphasizedDecelerate: "cubic-bezier(0.05, 0.7, 0.1, 1)",
  // 强调退出
  emphasizedAccelerate: "cubic-bezier(0.3, 0, 0.8, 0.15)",
  // 弹簧效果
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  // 流体过渡
  fluid: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  // 柔和弹跳
  softBounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
  // 线性
  linear: "linear",
} as const

// ============================================
// 2. 时长规范
// ============================================

export const durations = {
  instant: 100, // 即时反馈
  fast: 150, // 快速过渡
  normal: 300, // 标准过渡
  slow: 500, // 慢速过渡
  emphasis: 600, // 强调动画
  dramatic: 800, // 戏剧效果
  ambient: 2000, // 环境动画（如光晕脉冲）
} as const

// ============================================
// 3. 关键动效规范
// ============================================

export interface AnimationSpec {
  name: string
  description: string
  trigger: string
  duration: number
  easing: string
  properties: string[]
  degradation: string
}

export const keyAnimations: AnimationSpec[] = [
  {
    name: "modalScaleBlur",
    description: "弹窗弹入缩放 + 背景模糊",
    trigger: "弹窗 isOpen 状态变化",
    duration: durations.normal,
    easing: easings.spring,
    properties: ["scale", "opacity", "backdrop-filter"],
    degradation: "禁用 backdrop-filter，仅保留 scale + opacity",
  },
  {
    name: "galleryFluidTransition",
    description: "画廊切换流体过渡",
    trigger: "画作点击/滑动切换",
    duration: durations.emphasis,
    easing: easings.fluid,
    properties: ["transform", "opacity", "filter"],
    degradation: "简化为 crossfade，禁用 3D 变换",
  },
  {
    name: "buttonMicroVibration",
    description: "按钮微振动反馈",
    trigger: "按钮 hover/click",
    duration: durations.fast,
    easing: easings.standard,
    properties: ["transform: translateX"],
    degradation: "仅保留色彩渐变，禁用振动",
  },
  {
    name: "aiPanelPopup",
    description: "AI 面板弹出动画",
    trigger: "AI 按钮点击",
    duration: durations.slow,
    easing: easings.spring,
    properties: ["scale", "opacity", "y"],
    degradation: "简化为 fadeIn，禁用弹簧效果",
  },
  {
    name: "countdownFlip",
    description: "倒计时数字翻转",
    trigger: "每秒倒计时更新",
    duration: durations.slow,
    easing: easings.softBounce,
    properties: ["rotateX", "opacity"],
    degradation: "数字直接替换，无翻转动画",
  },
  {
    name: "parallaxScroll",
    description: "视差滚动效果",
    trigger: "页面滚动事件",
    duration: 0,
    easing: easings.linear,
    properties: ["transform: translateY"],
    degradation: "完全禁用视差，普通滚动",
  },
  {
    name: "cardHoverLift",
    description: "卡片悬浮抬起",
    trigger: "卡片 mouseenter/mouseleave",
    duration: durations.normal,
    easing: easings.standard,
    properties: ["transform: translateY", "box-shadow"],
    degradation: "仅保留边框高亮，禁用位移和阴影变化",
  },
  {
    name: "photoGlowPulse",
    description: "照片光晕脉冲",
    trigger: "照片加载完成/循环播放",
    duration: durations.ambient,
    easing: easings.standard,
    properties: ["box-shadow", "opacity"],
    degradation: "静态光晕，禁用脉冲动画",
  },
]

// ============================================
// 4. Framer Motion 预设
// ============================================

export const motionPresets = {
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  modalBackdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  modalContent: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 },
    transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
  },
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
}

// ============================================
// 5. 降级检测与开关
// ============================================

export function shouldReduceMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function getDevicePerformance(): "high" | "medium" | "low" {
  if (typeof window === "undefined") return "high"

  // 检测设备内存（如果可用）
  const nav = navigator as Navigator & { deviceMemory?: number }
  if (nav.deviceMemory && nav.deviceMemory < 4) return "low"

  // 检测硬件并发数
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return "medium"

  return "high"
}

export function getAnimationLevel(): "full" | "reduced" | "minimal" {
  if (shouldReduceMotion()) return "minimal"

  const performance = getDevicePerformance()
  switch (performance) {
    case "low":
      return "minimal"
    case "medium":
      return "reduced"
    default:
      return "full"
  }
}

// ============================================
// 6. CSS 动画类（Tailwind 兼容）
// ============================================

export const animationClasses = {
  // 按钮微振动
  buttonVibrate: "hover:animate-[vibrate_0.15s_ease-out] active:scale-95",
  // 卡片悬浮
  cardLift: "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/10",
  // 光晕脉冲
  glowPulse: "animate-[glow-pulse_2s_ease-in-out_infinite]",
  // 淡入上滑
  fadeInUp: "animate-[fade-in-up_0.5s_ease-out_forwards]",
  // 弹簧缩放
  springScale: "animate-[spring-scale_0.35s_cubic-bezier(0.34,1.56,0.64,1)_forwards]",
}

// Tailwind keyframes 配置（添加到 globals.css）
export const tailwindKeyframes = `
@keyframes vibrate {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.6); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spring-scale {
  0% { opacity: 0; transform: scale(0.9); }
  50% { transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}
`
