'use client'

import { MapPin, Navigation } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface HotelLocationProps {
  className?: string
}

/**
 * @description 婚礼地点信息组件
 * @project 婚礼网站
 */
export default function HotelLocation({ className }: HotelLocationProps) {
  const [isMapVisible, setIsMapVisible] = useState(false)

  const hotelInfo = {
    name: '富豪大酒店(阿新大道店)',
    address: '中国·河南省洛阳市孟津区将军路57号',
    coordinates: '34.734682, 112.367732',
    mapUrl: 'https://maps.apple.com/place?address=%E4%B8%AD%E5%9B%BD%E6%B2%B3%E5%8D%97%E7%9C%81%E6%B4%9B%E9%98%B3%E5%B8%82%E5%AD%9F%E6%B4%A5%E5%8C%BA%E5%B0%86%E5%86%9B%E8%B7%AF61%E5%8F%B7&coordinate=34.735724,112.367931&name=%E5%AF%8C%E8%B1%AA%E5%AE%B4%E4%BC%9A%E4%B8%AD%E5%BF%83&place-id=H2710I3F967D06FA5B7',
    imagePath: '/wedding/hotel-add.png'
  }

  const handleNavigate = () => {
    window.open(hotelInfo.mapUrl, '_blank')
  }

  const handleToggleMap = () => {
    setIsMapVisible(!isMapVisible)
  }

  return (
    <motion.div
      className={`bg-card rounded-xl border border-border overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* 地点标题与信息 */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-6 h-6 text-gold" />
          <h3 className="text-xl font-bold text-foreground">婚礼地点</h3>
        </div>
        
        <div className="space-y-3 mb-6">
          <div>
            <h4 className="font-semibold text-foreground">{hotelInfo.name}</h4>
            <p className="text-muted-foreground text-sm mt-1">{hotelInfo.address}</p>
            <p className="text-xs text-muted-foreground/60 mt-1">坐标：{hotelInfo.coordinates}</p>
          </div>
        </div>

        {/* 导航按钮 */}
        <Button
          onClick={handleNavigate}
          className="w-full bg-gold hover:bg-gold-dark text-graphite font-semibold py-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 mb-4"
          aria-label="一键导航到婚宴地点"
        >
          <Navigation className="w-5 h-5 mr-2" />
          一键导航到婚宴地点
        </Button>

        {/* 地图预览切换 */}
        <Button
          onClick={handleToggleMap}
          variant="ghost"
          className="w-full border border-border hover:bg-secondary/30 py-4 rounded-lg"
          aria-expanded={isMapVisible}
          aria-label="显示/隐藏地点导航图"
        >
          {isMapVisible ? '隐藏地图' : '查看地点导航图'}
        </Button>
      </div>

      {/* 地图预览 */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isMapVisible ? 'auto' : 0,
          opacity: isMapVisible ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="relative aspect-video">
          <img
            src={hotelInfo.imagePath}
            alt={`${hotelInfo.name}地址地图`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-graphite/60 to-transparent opacity-30" />
        </div>
      </motion.div>
    </motion.div>
  )
}
