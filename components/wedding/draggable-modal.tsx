"use client"

import type React from "react"
import { useRef, useEffect, useCallback, useState } from "react"
import { motion, AnimatePresence, useDragControls, type PanInfo } from "framer-motion"
import { X, GripHorizontal, Minimize2, Maximize2, Minus } from "@/components/icons"

export interface DraggableModalProps {
  /** 控制弹窗显示状态 */
  isOpen: boolean
  /** 关闭回调函数 */
  onClose: () => void
  /** 弹窗标题 */
  title: string
  /** 标题左侧图标 */
  icon?: React.ReactNode
  /** 弹窗内容 */
  children: React.ReactNode
  /** 初始位置 { x, y } */
  initialPosition?: { x: number; y: number }
  /** 弹窗宽度 (Tailwind class) */
  width?: string
  /** 弹窗最大高度 (Tailwind class) */
  maxHeight?: string
  /** 是否允许拖拽 */
  draggable?: boolean
  /** 是否显示最小化按钮 */
  minimizable?: boolean
  /** 是否显示最大化按钮 */
  maximizable?: boolean
  /** ARIA 标签，用于无障碍 */
  ariaLabel?: string
  /** ARIA 描述 ID */
  ariaDescribedBy?: string
  /** 最小化状态变化回调 */
  onMinimize?: (isMinimized: boolean) => void
  /** 最大化状态变化回调 */
  onMaximize?: (isMaximized: boolean) => void
  /** 拖拽开始回调 */
  onDragStart?: () => void
  /** 拖拽结束回调 */
  onDragEnd?: (position: { x: number; y: number }) => void
  /** 禁用背景点击关闭 */
  disableBackdropClose?: boolean
  /** 禁用 Esc 键关闭 */
  disableEscClose?: boolean
  /** 自定义 z-index */
  zIndex?: number
  /** 降级模式：禁用模糊动画 */
  reducedMotion?: boolean
}

// 弹窗动画变体：scale + blur + 阶段性阴影
const modalVariants: any = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    filter: "blur(20px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.35,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    filter: "blur(12px)",
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
}

const reducedModalVariants: any = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeIn" },
  },
}

const backdropVariants: any = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    backdropFilter: "blur(12px)",
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.2 },
  },
}

const reducedBackdropVariants: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

export default function DraggableModal({
  isOpen,
  onClose,
  title,
  icon,
  children,
  initialPosition,
  width = "max-w-md",
  maxHeight = "max-h-[80vh]",
  draggable = true,
  minimizable = true,
  maximizable = true,
  ariaLabel,
  ariaDescribedBy,
  onMinimize,
  onMaximize,
  onDragStart,
  onDragEnd,
  disableBackdropClose = false,
  disableEscClose = false,
  zIndex = 50,
  reducedMotion = false,
}: DraggableModalProps) {
  const dragControls = useDragControls()
  const modalRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [savedPosition, setSavedPosition] = useState({ x: 0, y: 0 })

  // 检测用户偏好减少动画
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      if (mediaQuery.matches) {
        // 自动启用降级模式
      }
    }
  }, [])

  // 键盘 Esc 关闭
  useEffect(() => {
    if (disableEscClose) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, disableEscClose])

  useEffect(() => {
    if (isOpen && modalRef.current && !isMinimized) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      firstElement?.focus()

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }

      window.addEventListener("keydown", handleTabKey)
      return () => window.removeEventListener("keydown", handleTabKey)
    }
  }, [isOpen, isMinimized])

  // 拖拽边界约束
  const constrainPosition = useCallback(() => {
    if (typeof window === "undefined" || isMaximized) return { x: 0, y: 0 }
    const maxX = window.innerWidth / 2 - 100
    const maxY = window.innerHeight / 2 - 100
    return {
      x: Math.max(-maxX, Math.min(maxX, position.x)),
      y: Math.max(-maxY, Math.min(maxY, position.y)),
    }
  }, [position, isMaximized])

  const handleMinimize = () => {
    const newState = !isMinimized
    setIsMinimized(newState)
    if (newState) {
      setSavedPosition(position)
    }
    onMinimize?.(newState)
  }

  const handleMaximize = () => {
    const newState = !isMaximized
    setIsMaximized(newState)
    if (newState) {
      setSavedPosition(position)
      setPosition({ x: 0, y: 0 })
    } else {
      setPosition(savedPosition)
    }
    onMaximize?.(newState)
  }

  const handleDragStartInternal = () => {
    setIsDragging(true)
    onDragStart?.()
  }

  const handleDragEndInternal = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    const newPosition = {
      x: position.x + info.offset.x,
      y: position.y + info.offset.y,
    }
    setPosition(newPosition)
    onDragEnd?.(newPosition)
  }

  const selectedModalVariants = reducedMotion ? reducedModalVariants : modalVariants
  const selectedBackdropVariants = reducedMotion ? reducedBackdropVariants : backdropVariants

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 微透背景遮罩 */}
          <motion.div
            variants={selectedBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-graphite/40"
            style={{ zIndex }}
            onClick={disableBackdropClose ? undefined : onClose}
            aria-hidden="true"
          />

          {/* 弹窗主体 */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel || title}
            aria-labelledby="modal-title"
            aria-describedby={ariaDescribedBy}
            variants={selectedModalVariants}
            initial="hidden"
            animate={isMinimized ? { scale: 0.1, opacity: 0.5 } : "visible"}
            exit="exit"
            drag={draggable && !isMaximized}
            dragControls={dragControls}
            dragMomentum={false}
            dragElastic={0.1}
            onDragStart={handleDragStartInternal}
            onDragEnd={handleDragEndInternal}
            style={{
              x: isMaximized ? 0 : constrainPosition().x,
              y: isMaximized ? 0 : constrainPosition().y,
              zIndex: zIndex + 1,
            }}
            className={`
              fixed 
              ${
                isMaximized
                  ? "inset-4 translate-x-0 translate-y-0"
                  : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              }
              ${isMaximized ? "w-auto" : `${width} w-[calc(100vw-2rem)]`}
              bg-card/95 backdrop-blur-xl rounded-2xl
              border border-border
              overflow-hidden
              ${isDragging ? "shadow-2xl shadow-gold/20" : "shadow-xl"}
              transition-shadow duration-200
              ${isMinimized ? "pointer-events-none" : ""}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 拖拽手柄头部 */}
            <div
              className={`
                flex items-center justify-between p-4 bg-gold/10 border-b border-border 
                ${draggable && !isMaximized ? "cursor-grab active:cursor-grabbing" : ""} 
                select-none
              `}
              onPointerDown={draggable && !isMaximized ? (e) => dragControls.start(e) : undefined}
            >
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                    {icon}
                  </div>
                )}
                <h2 id="modal-title" className="font-semibold text-foreground">
                  {title}
                </h2>
              </div>

              <div className="flex items-center gap-1">
                {draggable && !isMaximized && (
                  <GripHorizontal className="w-5 h-5 text-muted-foreground mr-2" aria-hidden="true" />
                )}

                {minimizable && (
                  <button
                    onClick={handleMinimize}
                    className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                    aria-label={isMinimized ? "还原窗口" : "最小化窗口"}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}

                {maximizable && (
                  <button
                    onClick={handleMaximize}
                    className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                    aria-label={isMaximized ? "还原窗口" : "最大化窗口"}
                  >
                    {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-destructive/20 hover:text-destructive flex items-center justify-center transition-colors"
                  aria-label="关闭弹窗"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            {!isMinimized && (
              <div className={`${isMaximized ? "h-[calc(100%-4rem)]" : maxHeight} overflow-y-auto`}>{children}</div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
