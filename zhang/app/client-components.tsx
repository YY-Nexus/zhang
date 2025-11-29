'use client'

import dynamic from 'next/dynamic'

// Load heavy client-only UI components dynamically
const FloatingAIButton = dynamic(() => import('@/components/wedding/floating-ai-button'))
const RegisterSW = dynamic(() => import('@/components/client/register-sw'))

/**
 * 客户端组件容器 - 包含所有需要客户端渲染的组件
 */
export default function ClientComponents() {
  return (
    <>
      <FloatingAIButton />
      <RegisterSW />
    </>
  )
}