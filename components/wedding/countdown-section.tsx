"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin } from "@/components/icons"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function FlipNumber({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      key={value}
      initial={{ rotateX: -90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300,
        duration: 0.5,
      }}
      className="flex flex-col items-center"
    >
      <div className="relative">
        <div className="w-16 h-20 md:w-24 md:h-28 bg-linear-to-b from-graphite to-graphite-light rounded-xl flex items-center justify-center shadow-lg border border-gold/20">
          <span className="text-3xl md:text-5xl font-bold text-gold tabular-nums">
            {value.toString().padStart(2, "0")}
          </span>
        </div>
        {/* 中线装饰 */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gold/20" />
      </div>
      <span className="mt-2 text-xs md:text-sm text-muted-foreground tracking-widest uppercase">{label}</span>
    </motion.div>
  )
}

export default function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = new Date("2025-11-29T11:30:00+08:00").getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative py-20 md:py-32 bg-background overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm tracking-widest uppercase">Save The Date</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2 mb-4">距离婚礼还有</h2>
          <p className="text-muted-foreground max-w-md mx-auto">期待与您共同见证这美好时刻 💕</p>
        </motion.div>

        {/* 倒计时数字 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center gap-3 md:gap-6 mb-16"
        >
          <FlipNumber value={timeLeft.days} label="天" />
          <div className="flex items-center text-gold text-2xl md:text-4xl font-bold self-start mt-6 md:mt-8">:</div>
          <FlipNumber value={timeLeft.hours} label="时" />
          <div className="flex items-center text-gold text-2xl md:text-4xl font-bold self-start mt-6 md:mt-8">:</div>
          <FlipNumber value={timeLeft.minutes} label="分" />
          <div className="flex items-center text-gold text-2xl md:text-4xl font-bold self-start mt-6 md:mt-8">:</div>
          <FlipNumber value={timeLeft.seconds} label="秒" />
        </motion.div>

        {/* 婚礼信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {/* 日期 */}
          <div className="bg-card rounded-2xl p-6 border border-border hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10 group">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
              <Calendar className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">婚礼日期</h3>
            <p className="text-muted-foreground text-sm">2025年11月29日</p>
            <p className="text-gold text-sm">农历十月初十 星期六</p>
          </div>

          {/* 时间 */}
          <div className="bg-card rounded-2xl p-6 border border-border hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10 group">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
              <Clock className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">婚宴时间</h3>
            <p className="text-muted-foreground text-sm">上午 11:30</p>
            <p className="text-gold text-sm">敬请准时出席</p>
          </div>

          {/* 地点 */}
          <div className="bg-card rounded-2xl p-6 border border-border hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10 group">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
              <MapPin className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">婚宴地点</h3>
            <p className="text-muted-foreground text-sm">富豪大酒店(阿新大道店)</p>
            <p className="text-gold text-sm">洛阳市孟津区将军路57号</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
