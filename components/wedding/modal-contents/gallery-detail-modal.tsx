'use client'

import type React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  MessageCircle,
  Share2,
  Download,
  ChevronLeft,
  ChevronRight,
  Send,
  Music,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { galleryPhotos } from '../gallery-section-photos'

type Photo = (typeof galleryPhotos)[number]

interface GalleryDetailModalContentProps {
  photo: Photo
  photos: Photo[]
  onNavigate: (photo: Photo) => void
  onClose: () => void
}

export default function GalleryDetailModalContent({
  photo,
  photos,
  onNavigate,
  onClose,
}: GalleryDetailModalContentProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(photo.likes)
  const [comments, setComments] = useState(photo.comments || [])
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(false)

  const currentIndex = photos.findIndex(p => p.id === photo.id)

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length
    onNavigate(photos[prevIndex])
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % photos.length
    onNavigate(photos[nextIndex])
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(prev => (isLiked ? prev - 1 : prev + 1))
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setComments(prev => [{ name: '访客', text: newComment, time: '刚刚' }, ...prev])
    setNewComment('')
  }

  return (
    <div className="flex flex-col md:flex-row max-h-[80vh]">
      {/* 图片区域 */}
      <div className="relative flex-1 bg-graphite/50 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.img
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            src={photo.src || '/placeholder.svg'}
            alt={photo.title}
            className="max-w-full max-h-[60vh] object-contain"
          />
        </AnimatePresence>

        {/* 导航按钮 */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-graphite/60 text-cream flex items-center justify-center hover:bg-graphite transition-colors"
          aria-label="上一张"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-graphite/60 text-cream flex items-center justify-center hover:bg-graphite transition-colors"
          aria-label="下一张"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* 图片计数 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-graphite/60 text-cream text-sm">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>

      {/* 信息面板 */}
      <div className="w-full md:w-80 flex flex-col border-l border-border">
        {/* 标题和操作 */}
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-lg mb-1">{photo.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">张波 & 邓芮 婚礼相册</p>

          {/* 关联音乐 */}
          {photo.linkedMusic && (
            <div className="flex items-center gap-2 p-2 bg-gold/10 rounded-lg mb-4">
              <Music className="w-4 h-4 text-gold" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{photo.linkedMusic.title}</p>
                <p className="text-xs text-muted-foreground truncate">{photo.linkedMusic.artist}</p>
              </div>
              <Button size="sm" variant="ghost" className="h-7 text-gold">
                播放
              </Button>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            <Button
              variant={isLiked ? 'default' : 'outline'}
              size="sm"
              onClick={handleLike}
              className={isLiked ? 'bg-gold text-graphite' : ''}
            >
              <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {likes}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowComments(!showComments)}>
              <MessageCircle className="w-4 h-4 mr-1" />
              {comments.length}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 评论区域 */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* 评论列表 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-48">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    暂无评论，快来抢沙发吧！
                  </p>
                ) : (
                  comments.map((comment, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-semibold shrink-0">
                        {comment.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{comment.name}</span>
                          <span className="text-xs text-muted-foreground">{comment.time}</span>
                        </div>
                        <p className="text-sm text-foreground">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 评论输入 */}
              <form onSubmit={handleComment} className="p-4 border-t border-border flex gap-2">
                <Input
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="写下您的评论..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-gold text-graphite hover:bg-gold/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
