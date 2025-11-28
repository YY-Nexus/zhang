'use client'

import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Download } from '@/components/icons'

interface QRCodeCheckinProps {
  guestInfo: {
    name: string
    phone: string
    attending: string
    guests: string
  }
  onClose?: () => void
}

export default function QRCodeCheckin({ guestInfo, onClose }: QRCodeCheckinProps) {
  // 生成签到数据
  const checkinData = {
    guestName: guestInfo.name,
    phone: guestInfo.phone,
    attending: guestInfo.attending,
    guests: guestInfo.guests,
    timestamp: Date.now(),
    eventId: 'wedding-20251129',
  }

  // 将数据转换为JSON字符串，用于生成QR码
  const qrData = JSON.stringify(checkinData)

  // 下载QR码
  const handleDownload = () => {
    const element = document.getElementById('checkin-qr-code')
    if (!element || !(element instanceof SVGElement)) return

    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(element)
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wedding-checkin-${guestInfo.name}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-card rounded-2xl border border-border"
    >
      <h3 className="text-xl font-bold text-foreground mb-4 text-center">签到二维码</h3>
      <p className="text-sm text-muted-foreground mb-6 text-center">
        婚礼当天出示此二维码即可快速签到
      </p>
      
      <div className="flex flex-col items-center gap-4">
        {/* QR码显示 */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <QRCodeSVG
            id="checkin-qr-code"
            value={qrData}
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin
          />
        </div>
        
        {/* 嘉宾信息 */}
        <div className="w-full max-w-xs bg-gold/10 rounded-lg p-3 text-sm">
          <p className="font-medium text-center mb-2">{guestInfo.name}</p>
          <p className="text-center text-muted-foreground">{guestInfo.phone}</p>
          <p className="text-center text-gold mt-1">
            {guestInfo.attending === 'yes' ? `${guestInfo.guests}人出席` : '无法出席'}
          </p>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex gap-2 w-full max-w-xs">
          <Button
            onClick={handleDownload}
            className="flex-1 bg-gold text-graphite hover:bg-gold/90"
          >
            <Download className="w-4 h-4 mr-2" />
            保存二维码
          </Button>
          {onClose && (
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              关闭
            </Button>
          )}
        </div>
        
        {/* 提示信息 */}
        <p className="text-xs text-muted-foreground text-center mt-2">
          建议保存此二维码到手机，方便婚礼当天使用
        </p>
      </div>
    </motion.div>
  )
}