"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, MessageCircle, Eye, Music } from "@/components/icons"
import DraggableModal from "./draggable-modal"
import GalleryDetailModalContent from "./modal-contents/gallery-detail-modal"

const galleryPhotos = [
  {
    id: 1,
    src: "/Wedding Photos/Groom's-Solo-Photos5.jpg",
    category: "新郎",
    title: "新郎 · 张波",
    likes: 128,
    comments: [
      { name: "李明", text: "帅气！", time: "10分钟前" },
      { name: "王芳", text: "西装很合身", time: "30分钟前" },
    ],
    linkedMusic: { title: "今天你要嫁给我", artist: "陶喆" },
  },
  {
    id: 2,
    src: "/Wedding Photos/Bride's-Solo-Photos5.jpg",
    category: "新娘",
    title: "新娘 · 邓芮",
    likes: 256,
    comments: [{ name: "赵丽", text: "太美了！", time: "5分钟前" }],
    linkedMusic: { title: "最浪漫的事", artist: "赵咏华" },
  },
  {
    id: 3,
    src: "/Wedding Photos/Wedding Document Photo.jpg",
    category: "合照",
    title: "执子之手",
    likes: 512,
    comments: [],
    linkedMusic: { title: "爱很简单", artist: "陶喆" },
  },
  {
    id: 4,
    src: "/Wedding Photos/Son's-Photos5.jpg",
    category: "全家福",
    title: "爱的结晶",
    likes: 384,
    comments: [{ name: "张伟", text: "宝宝好可爱！", time: "1小时前" }],
  },
  {
    id: 5,
    src: "/Wedding Photos/Groom's-Solo-Photos6.jpg",
    category: "新郎",
    title: "绅士风度",
    likes: 96,
    comments: [],
  },
  {
    id: 6,
    src: "/Wedding Photos/Bride's-Solo-Photos6.jpg",
    category: "新娘",
    title: "优雅绽放",
    likes: 192,
    comments: [],
  },
  {
    id: 7,
    src: "/Wedding Photos/Son's-Photos6.jpg",
    category: "全家福",
    title: "幸福时光",
    likes: 288,
    comments: [],
  },
  {
    id: 8,
    src: "/Wedding Photos/Son's-Photos7.jpg",
    category: "全家福",
    title: "温馨瞬间",
    likes: 176,
    comments: [],
  },
  {
    id: 9,
    src: "/Wedding Photos/Groom's-Solo-Photos7.jpg",
    category: "新郎",
    title: "阳光笑容",
    likes: 145,
    comments: [],
  },
  {
    id: 10,
    src: "/Wedding Photos/Bride's-Solo-Photos7.jpg",
    category: "新娘",
    title: "甜蜜微笑",
    likes: 210,
    comments: [],
  },
  {
    id: 11,
    src: "/Wedding Photos/Groom's-Solo-Photos8.jpg",
    category: "新郎",
    title: "帅气定格",
    likes: 118,
    comments: [],
  },
  {
    id: 12,
    src: "/Wedding Photos/Son's-Photos8.jpg",
    category: "全家福",
    title: "童真笑颜",
    likes: 320,
    comments: [],
  },
  {
    id: 13,
    src: "/Wedding Photos/Groom's-Solo-Photos9.jpg",
    category: "新郎",
    title: "自信姿态",
    likes: 135,
    comments: [],
  },
  {
    id: 14,
    src: "/Wedding Photos/Groom's-Solo-Photos10.jpg",
    category: "新郎",
    title: "温柔目光",
    likes: 168,
    comments: [],
  },
  {
    id: 15,
    src: "/Wedding Photos/Son's-Photos9.jpg",
    category: "全家福",
    title: "快乐成长",
    likes: 245,
    comments: [],
  },
  {
    id: 16,
    src: "/Wedding Photos/Son's-Photos10.jpg",
    category: "全家福",
    title: "天真烂漫",
    likes: 298,
    comments: [],
  },
  {
    id: 17,
    src: "/Wedding Photos/Son's-Photos11.jpg",
    category: "全家福",
    title: "纯真笑容",
    likes: 276,
    comments: [],
  },
]

const categories = ["全部", "新郎", "新娘", "合照", "全家福"]

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof galleryPhotos)[0] | null>(null)
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(new Set())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredPhotos =
    selectedCategory === "全部" ? galleryPhotos : galleryPhotos.filter((p) => p.category === selectedCategory)

  const handleLike = (photoId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setLikedPhotos((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(photoId)) {
        newSet.delete(photoId)
      } else {
        newSet.add(photoId)
      }
      return newSet
    })
  }

  const handlePhotoClick = (photo: (typeof galleryPhotos)[0]) => {
    setSelectedPhoto(photo)
    setIsModalOpen(true)
  }

  const handleNavigate = useCallback((photo: (typeof galleryPhotos)[0]) => {
    setSelectedPhoto(photo)
  }, [])

  return (
    <section id="gallery" className="relative py-20 md:py-32 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm tracking-widest uppercase">Photo Gallery</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2">精彩瞬间</h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">点击照片查看详情、留言互动与关联音乐</p>
        </motion.div>

        {/* 分类筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gold text-graphite shadow-lg shadow-gold/20"
                  : "bg-card text-muted-foreground hover:bg-gold/10 hover:text-gold border border-border"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* 照片网格 */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl hover:shadow-gold/10"
                onClick={() => handlePhotoClick(photo)}
              >
                <img
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(photo.title)}`
                  }}
                />

                {/* 悬停遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-graphite/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* 悬停信息 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="text-cream font-medium mb-2">{photo.title}</h4>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => handleLike(photo.id, e)}
                      className="flex items-center gap-1 text-cream/80 hover:text-gold transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${likedPhotos.has(photo.id) ? "fill-gold text-gold" : ""}`} />
                      <span className="text-xs">{photo.likes + (likedPhotos.has(photo.id) ? 1 : 0)}</span>
                    </button>
                    <span className="flex items-center gap-1 text-cream/80">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs">{photo.comments.length}</span>
                    </span>
                    <span className="flex items-center gap-1 text-cream/80">
                      <Eye className="w-4 h-4" />
                      <span className="text-xs">查看</span>
                    </span>
                  </div>
                </div>

                {/* 音乐关联标识 */}
                {photo.linkedMusic && (
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-gold/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Music className="w-4 h-4 text-graphite" />
                  </div>
                )}

                {/* 角标 */}
                <div className="absolute top-3 right-3 px-2 py-1 bg-gold/90 rounded-full text-xs text-graphite font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {photo.category}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 照片详情弹窗 */}
      {selectedPhoto && (
        <DraggableModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedPhoto(null)
          }}
          title={selectedPhoto.title}
          icon={<Eye className="w-5 h-5" />}
          width="max-w-4xl"
          maxHeight="max-h-[85vh]"
        >
          <GalleryDetailModalContent
            photo={selectedPhoto}
            photos={filteredPhotos}
            onNavigate={handleNavigate}
            onClose={() => {
              setIsModalOpen(false)
              setSelectedPhoto(null)
            }}
          />
        </DraggableModal>
      )}
    </section>
  )
}
