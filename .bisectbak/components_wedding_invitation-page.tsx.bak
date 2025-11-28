"use client"

import { motion } from "framer-motion"
import InvitationCard from "./invitation-card"
import { Heart } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function InvitationPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold/10 via-cream to-gold/5 py-8 md:py-12 px-4">
      {/* 返回按钮 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-2xl mx-auto mb-6"
      >
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="text-graphite hover:text-gold"
        >
          <span className="mr-2">←</span>
          返回首页
        </Button>
      </motion.div>

      {/* 邀请函卡片 */}
      <InvitationCard />
    </div>
  )
}

