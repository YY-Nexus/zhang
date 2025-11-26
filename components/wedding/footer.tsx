"use client"

import { motion } from "framer-motion"
import { Heart, Phone, MapPin, Calendar } from "@/components/icons"

export default function Footer() {
  return (
    <footer className="relative py-16 bg-graphite text-cream overflow-hidden">
      {/* 装饰 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Logo */}
          <div className="text-5xl mb-4">囍</div>
          <h2 className="text-2xl md:text-3xl font-bold text-gold mb-2">张波 & 邓芮</h2>
          <p className="text-cream/60 mb-8">Zhang Bo & Deng Rui</p>

          {/* 信息 */}
          <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm">
            <div className="flex items-center gap-2 text-cream/70">
              <Calendar className="w-4 h-4 text-gold" />
              <span>2025.11.29</span>
            </div>
            <div className="flex items-center gap-2 text-cream/70">
              <MapPin className="w-4 h-4 text-gold" />
              <span>洛阳孟津·富豪大酒店</span>
            </div>
          </div>

          {/* 联系方式 */}
          <div className="flex justify-center gap-6 mb-8">
            <a
              href="tel:18736396660"
              className="flex items-center gap-2 text-cream/70 hover:text-gold transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>新郎：18736396660</span>
            </a>
            <a
              href="tel:19103895555"
              className="flex items-center gap-2 text-cream/70 hover:text-gold transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>新娘：19103895555</span>
            </a>
          </div>

          {/* 分割线 */}
          <div className="w-24 h-px bg-gold/30 mx-auto mb-6" />

          {/* 版权 */}
          <p className="text-cream/40 text-xs flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-gold fill-gold" /> for our special day
          </p>
          <p className="text-cream/30 text-xs mt-2">© 2025 张波 & 邓芮 婚礼邀请函</p>
        </motion.div>
      </div>
    </footer>
  )
}
