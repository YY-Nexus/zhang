"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Heart, Phone } from "@/components/icons"

export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 md:py-32 bg-secondary/30 overflow-hidden">
      {/* 装饰 */}
      <div className="absolute top-10 right-10 text-8xl text-gold/5 font-bold select-none">囍</div>
      <div className="absolute bottom-10 left-10 text-8xl text-gold/5 font-bold select-none rotate-180">囍</div>

      <div className="container mx-auto px-4">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm tracking-widest uppercase">About Us</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2">关于我们</h2>
        </motion.div>

        {/* 新人介绍 */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 max-w-5xl mx-auto">
          {/* 新郎 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6">
              <Image
                src="/Wedding Photos/Groom"
                alt="新郎 张波"
                width={300}
                height={400}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-gold text-sm tracking-wider">THE GROOM</span>
                <h3 className="text-cream text-2xl md:text-3xl font-bold mt-1">张波</h3>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                一个温暖而有担当的人，用真诚和努力书写人生。遇见邓芮，是生命中最美的礼物。
              </p>
              <a
                href="tel:18736396660"
                className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>18736396660</span>
              </a>
            </div>
          </motion.div>

          {/* 新娘 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group md:mt-12"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6">
              <Image
                src="/Wedding Photos/Bride"
                alt="新娘 邓芮"
                width={300}
                height={400}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-gold text-sm tracking-wider">THE BRIDE</span>
                <h3 className="text-cream text-2xl md:text-3xl font-bold mt-1">邓芮</h3>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                温柔善良，笑容明媚。相信爱与美好，期待与张波携手，共同创造幸福的未来。
              </p>
              <a
                href="tel:19103895555"
                className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>19103895555</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* 爱情宣言 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center max-w-2xl mx-auto"
        >
          <Heart className="w-8 h-8 text-gold mx-auto mb-4 fill-gold" />
          <blockquote className="text-xl md:text-2xl text-foreground italic leading-relaxed">
            "诚挚邀请您和您的家人参加我们的婚礼，分享我们的幸福和喜悦！"
          </blockquote>
          <p className="text-gold mt-4">—— 张波 & 邓芮</p>
        </motion.div>
      </div>
    </section>
  )
}
