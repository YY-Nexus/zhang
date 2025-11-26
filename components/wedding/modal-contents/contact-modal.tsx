"use client"

import { motion } from "framer-motion"
import { Phone, MessageCircle, Navigation, MapPin, Copy, Check } from "@/components/icons"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const contacts = [
  { name: "新郎 张波", phone: "18736396660", role: "groom" },
  { name: "新娘 邓芮", phone: "19103895555", role: "bride" },
]

const venueInfo = {
  name: "富豪大酒店(阿新大道店)",
  address: "河南省洛阳市孟津区将军路57号",
  mapsUrl:
    "https://maps.apple.com/place?address=%E4%B8%AD%E5%9B%BD%E6%B2%B3%E5%8D%97%E7%9C%81%E6%B4%9B%E9%98%B3%E5%B8%82%E5%AD%9F%E6%B4%A5%E5%8C%BA%E9%BA%BB%E5%B1%AF%E9%95%87%E5%9C%9F%E5%9C%B0%E6%89%80%E5%AF%B9%E9%9D%A2&coordinate=34.734682,112.367732&name=%E5%AF%8C%E8%B1%AA%E5%A4%A7%E9%85%92%E5%BA%97(%E9%98%BF%E6%96%B0%E5%A4%A7%E9%81%93%E5%BA%97)",
}

export default function ContactModalContent() {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null)

  const handleCopy = async (phone: string) => {
    await navigator.clipboard.writeText(phone)
    setCopiedPhone(phone)
    setTimeout(() => setCopiedPhone(null), 2000)
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  return (
    <div className="p-4 space-y-6">
      {/* 新人联系方式 */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          新人联系方式
        </h4>
        <div className="space-y-3">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.phone}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border"
            >
              <div
                className={`
                w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold
                ${contact.role === "groom" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"}
              `}
              >
                {contact.role === "groom" ? "郎" : "娘"}
              </div>
              <div className="flex-1">
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-muted-foreground">{contact.phone}</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={() => handleCopy(contact.phone)} className="w-9 h-9">
                  {copiedPhone === contact.phone ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  onClick={() => handleCall(contact.phone)}
                  className="w-9 h-9 bg-gold text-graphite hover:bg-gold/90"
                >
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 场地信息 */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          婚礼场地
        </h4>
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* 地图预览 */}
          <div className="h-32 bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-gold mx-auto mb-2" />
              <p className="text-sm font-medium">{venueInfo.name}</p>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-3">{venueInfo.address}</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => handleCopy(venueInfo.address)}>
                <Copy className="w-4 h-4 mr-2" />
                复制地址
              </Button>
              <Button
                className="flex-1 bg-gold text-graphite hover:bg-gold/90"
                onClick={() => window.open(venueInfo.mapsUrl, "_blank")}
              >
                <Navigation className="w-4 h-4 mr-2" />
                开始导航
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 微信沟通 */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-green-700 dark:text-green-400">微信联系</p>
          <p className="text-xs text-green-600 dark:text-green-500">扫码添加新人微信</p>
        </div>
        <Button variant="outline" size="sm" className="border-green-300 text-green-600 bg-transparent">
          显示二维码
        </Button>
      </div>
    </div>
  )
}
