"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Navigation, Clock, Heart, Coffee, Utensils, PartyPopper, Phone, AlertCircle } from "@/components/icons"
import { Button } from "@/components/ui/button"
import DraggableModal from "./draggable-modal"

const scheduleItems = [
  {
    time: "10:00",
    title: "迎亲出发",
    desc: "新郎迎亲队伍出发，遵循洛阳传统婚俗",
    icon: Heart,
  },
  {
    time: "10:30",
    title: "新娘出阁",
    desc: "完成敬茶礼、改口茶等传统仪式",
    icon: Coffee,
  },
  {
    time: "11:00",
    title: "来宾签到",
    desc: "宾客到场签到，入座就位",
    icon: Clock,
  },
  {
    time: "11:30",
    title: "婚礼仪式",
    desc: "证婚、交换戒指、拜堂等仪式",
    icon: PartyPopper,
  },
  {
    time: "12:00",
    title: "婚宴开席",
    desc: "新人敬酒，共享喜宴",
    icon: Utensils,
  },
]

export default function ScheduleSection() {
  const [callModalOpen, setCallModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<{
    name: string
    phone: string
    role: string
  } | null>(null)

  const contacts = [
    { name: "张波", phone: "18736396660", role: "新郎" },
    { name: "邓芮", phone: "19103895555", role: "新娘" },
  ]

  const handleNavigate = () => {
    window.open(
      "https://maps.apple.com/place?address=%E4%B8%AD%E5%9B%BD%E6%B2%B3%E5%8D%97%E7%9C%81%E6%B4%9B%E9%98%B3%E5%B8%82%E5%AD%9F%E6%B4%A5%E5%8C%BA%E9%BA%BB%E5%B1%AF%E9%95%87%E5%9C%9F%E5%9C%B0%E6%89%80%E5%AF%B9%E9%9D%A2&coordinate=34.734682,112.367732&name=%E5%AF%8C%E8%B1%AA%E5%A4%A7%E9%85%92%E5%BA%97(%E9%98%BF%E6%96%B0%E5%A4%A7%E9%81%93%E5%BA%97)",
      "_blank",
    )
  }

  const handleCallClick = (contact: (typeof contacts)[0]) => {
    setSelectedContact(contact)
    setCallModalOpen(true)
  }

  const confirmCall = () => {
    if (selectedContact) {
      window.location.href = `tel:${selectedContact.phone}`
      console.log("[v0] 呼叫日志:", {
        contact: selectedContact.name,
        phone: selectedContact.phone,
        timestamp: new Date().toISOString(),
      })
    }
    setCallModalOpen(false)
  }

  return (
    <section id="schedule" className="relative py-20 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm tracking-widest uppercase">Wedding Schedule</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2">婚礼日程</h2>
          <p className="text-muted-foreground mt-4">
            <span className="text-gold">2025年11月29日</span>
            <span className="mx-2">|</span>
            <span>农历乙巳年十月初十 星期六</span>
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* 时间线 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* 竖线 */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold via-gold/50 to-transparent" />

            <div className="space-y-8">
              {scheduleItems.map((item, index) => (
                <motion.div
                  key={item.time}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex gap-6 group"
                >
                  {/* 时间点 */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-card border-2 border-gold flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                    <item.icon className="w-5 h-5 text-gold group-hover:text-graphite transition-colors" />
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 pb-8">
                    <span className="text-gold text-sm font-medium">{item.time}</span>
                    <h3 className="text-lg font-semibold text-foreground mt-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 地图与地点 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* 地图预览 */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="婚宴地点地图"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-start gap-3 text-cream">
                  <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">富豪大酒店(阿新大道店)</h4>
                    <p className="text-sm text-cream/70">河南省洛阳市孟津区将军路57号</p>
                    <p className="text-xs text-cream/50 mt-1">坐标：34.734682, 112.367732</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 导航按钮 */}
            <Button
              onClick={handleNavigate}
              className="w-full bg-gold hover:bg-gold-dark text-graphite font-semibold py-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
              aria-label="一键导航到婚宴地点"
            >
              <Navigation className="w-5 h-5 mr-2" />
              一键导航到婚宴地点
            </Button>

            {/* 一键呼叫按钮 */}
            <div className="grid grid-cols-2 gap-4">
              {contacts.map((contact) => (
                <Button
                  key={contact.phone}
                  onClick={() => handleCallClick(contact)}
                  variant="outline"
                  className="py-6 rounded-xl border-gold/50 hover:bg-gold/10 hover:border-gold transition-all"
                  aria-label={`拨打${contact.role}${contact.name}电话`}
                >
                  <Phone className="w-4 h-4 mr-2 text-gold" />
                  <span>呼叫{contact.role}</span>
                </Button>
              ))}
            </div>

            {/* 温馨提示 */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-xl">📍</span> 温馨提示
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>酒店设有停车场，自驾来宾可免费停车</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>如需接送服务，请提前联系新人</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>洛阳习俗提醒：婚宴当日请着红色或喜庆服饰</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      <DraggableModal
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        title="确认拨打电话"
        icon={<Phone className="w-5 h-5 text-gold" />}
        width="max-w-sm"
        ariaLabel="电话呼叫确认对话框"
        minimizable={false}
        maximizable={false}
      >
        {selectedContact && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                <Phone className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{selectedContact.name}</p>
                <p className="text-sm text-muted-foreground">{selectedContact.role}</p>
                <p className="text-gold">{selectedContact.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-amber-700 dark:text-amber-400">
                点击确认后将拨打{selectedContact.role}电话，请确保在合适的时间联系
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCallModalOpen(false)} className="flex-1">
                取消
              </Button>
              <Button onClick={confirmCall} className="flex-1 bg-gold hover:bg-gold-dark text-graphite">
                <Phone className="w-4 h-4 mr-2" />
                确认拨打
              </Button>
            </div>
          </div>
        )}
      </DraggableModal>
    </section>
  )
}
