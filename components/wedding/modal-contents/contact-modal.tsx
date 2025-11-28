"use client"

import { motion } from "framer-motion"
import { Phone, MessageCircle, Navigation, MapPin, Copy, Check } from "@/components/icons"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { venueInfo, openNavigation, openMapApp, makeCall, copyAddress } from "@/lib/navigation-utils"

const contacts = [
  { name: "新郎 张波", phone: "18736396660", role: "groom" },
  { name: "新娘 邓芮", phone: "19103895555", role: "bride" },
]

export default function ContactModalContent() {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null)

  const handleCopy = async (phone: string) => {
    await navigator.clipboard.writeText(phone)
    setCopiedPhone(phone)
    setTimeout(() => setCopiedPhone(null), 2000)
  }

  const handleCall = (phone: string) => {
    // 使用优化的电话拨打函数（自动处理桌面端和移动端）
    makeCall(phone)
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
          <div className="h-32 bg-linear-to-br from-gold/10 to-gold/5 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-gold mx-auto mb-2" />
              <p className="text-sm font-medium">{venueInfo.name}</p>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-3">{venueInfo.address}</p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 bg-transparent" 
                  onClick={async () => {
                    const success = await copyAddress()
                    if (success) {
                      setCopiedPhone('address')
                      setTimeout(() => setCopiedPhone(null), 2000)
                    }
                  }}
                >
                  {copiedPhone === 'address' ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      复制地址
                    </>
                  )}
                </Button>
                <Button
                  className="flex-1 bg-gold text-graphite hover:bg-gold/90"
                  onClick={() => openNavigation()}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  开始导航
                </Button>
              </div>
              {/* 多地图选择（移动端显示） */}
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => openMapApp('amap')}
                >
                  高德地图
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => openMapApp('baidu')}
                >
                  百度地图
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => openMapApp('google')}
                >
                  Google地图
                </Button>
              </div>
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
