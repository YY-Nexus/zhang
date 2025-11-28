'use client'

import { Eye, Heart, MessageCircle, Music } from '@/components/icons'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import type React from 'react'
import { useCallback, useState } from 'react'
import DraggableModal from './draggable-modal'
import { categories, galleryPhotos } from './gallery-section-photos'
import GalleryDetailModalContent from './modal-contents/gallery-detail-modal'

// 定义照片类型
interface Photo {
  id: number;
  src: string;
  title: string;
  category: string;
  aspectRatio?: '4/3' | '9/16';
  likes: number;
  comments: any[];
  linkedMusic?: boolean;
}

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof galleryPhotos)[0] | null>(null)
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(new Set())
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 过滤照片并确保没有重复项，优先使用主婚照片
  const filteredPhotos = () => {
    // 首先筛选出符合分类的照片
    let photos = selectedCategory === '全部'
      ? galleryPhotos
      : galleryPhotos.filter(p => p.category === selectedCategory);
    
    // 创建Map用于去重和排序
    const photoMap = new Map<number, typeof galleryPhotos[0]>();
    const mainWeddingPhotos: typeof galleryPhotos[0][] = [];
    const otherPhotos: typeof galleryPhotos[0][] = [];
    
    // 分离主婚照片和普通照片
    photos.forEach(photo => {
      // 检查标题中是否包含主婚相关标识
      const isMainWedding = /(主婚|主婚纱)/i.test(photo.title);
      
      if (isMainWedding) {
        mainWeddingPhotos.push(photo);
      } else {
        otherPhotos.push(photo);
      }
    });
    
    // 先添加所有主婚照片，再添加普通照片，确保无重复
    [...mainWeddingPhotos, ...otherPhotos].forEach(photo => {
      photoMap.set(photo.id, photo);
    });
    
    return Array.from(photoMap.values());
  };

  const handleLike = (photoId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setLikedPhotos(prev => {
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
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            点击照片查看详情、留言互动与关联音乐
          </p>
        </motion.div>

        {/* 分类筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gold text-graphite shadow-lg shadow-gold/20'
                  : 'bg-card text-muted-foreground hover:bg-gold/10 hover:text-gold border border-border'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* 照片网格 - 错落有致的布局，优化响应式显示 */}
        <motion.div 
          layout 
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 mt-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredPhotos().map((photo, index) => {
              // 生成随机位置偏移，实现错落有致的布局
              const getRandomOffset = () => {
                const seed = index % 4;
                return {
                  0: 'translate-y-0',
                  1: 'translate-y-[-3px]',
                  2: 'translate-y-[3px]',
                  3: 'translate-y-[-1px]'
                }[seed];
              };
              
              // 获取照片比例，默认为4:3
              const aspectRatio = photo.aspectRatio || '4/3';
              
              return (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl hover:shadow-gold/10 ${getRandomOffset()}`}
                  onClick={() => handlePhotoClick(photo)}
                  // 不设置固定高度，让aspect-ratio类控制照片比例
                >
                  <div className={aspectRatio === '4/3' ? 'aspect-[4/3]' : 'aspect-[9/16]'}>
                    <Image
                      src={photo.src || '/placeholder.svg'}
                      alt={photo.title}
                      fill
                      className="object-contain bg-black/20 transition-transform duration-500 group-hover:scale-110"
                      quality={85}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='${aspectRatio === '4/3' ? '300' : '711'}' viewBox='0 0 400 ${aspectRatio === '4/3' ? '300' : '711'}'%3E%3Crect width='400' height='${aspectRatio === '4/3' ? '300' : '711'}' fill='%231a1a1a'/%3E%3C/svg%3E`}
                      onError={e => {
                        const target = e.currentTarget as HTMLImageElement
                        target.src = `/placeholder.svg?height=${aspectRatio === '4/3' ? '300' : '711'}&width=400&query=${encodeURIComponent(
                          photo.title
                        )}`
                      }}
                    />
                  </div>
                  
                  {/* 悬停遮罩 */}
                  <div className="absolute inset-0 bg-linear-to-t from-graphite/90 via-graphite/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* 悬停信息 */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-cream font-medium mb-2">{photo.title}</h4>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={e => handleLike(photo.id, e)}
                        className="flex items-center gap-1 min-h-[44px] px-2 text-cream/80 hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded"
                        aria-label={likedPhotos.has(photo.id) ? "取消点赞" : "点赞"}
                        aria-pressed={likedPhotos.has(photo.id)}
                      >
                        <Heart
                          className={`w-4 h-4 ${likedPhotos.has(photo.id) ? 'fill-gold text-gold' : ''}`}
                        />
                        <span className="text-xs">
                          {photo.likes + (likedPhotos.has(photo.id) ? 1 : 0)}
                        </span>
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
              );
            })}
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
          <div className={`w-full max-w-3xl mx-auto ${selectedPhoto.aspectRatio === '4/3' ? 'aspect-[4/3]' : 'aspect-[9/16]'}`}>
            <Image
              src={selectedPhoto.src}
              alt={selectedPhoto.title || '照片详情'}
              fill
              className="object-contain"
              quality={95}
              priority
              placeholder="blur"
              blurDataURL={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='${selectedPhoto.aspectRatio === '4/3' ? '600' : '1422'}' viewBox='0 0 800 ${selectedPhoto.aspectRatio === '4/3' ? '600' : '1422'}'%3E%3Crect width='800' height='${selectedPhoto.aspectRatio === '4/3' ? '600' : '1422'}' fill='%231a1a1a'/%3E%3C/svg%3E`}
            />
          </div>
          <GalleryDetailModalContent
            photo={selectedPhoto}
            photos={filteredPhotos()}
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
