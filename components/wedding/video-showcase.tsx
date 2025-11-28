"use client"

import { motion } from "framer-motion"
import VideoPlayer from "./video-player"
import { useState, useEffect } from "react"

interface VideoShowcaseProps {
  variant?: 1 | 2 | 3
}

// 视频数据 - 所有主婚视频（优先使用，确保不重复）
const weddingVideos = [
  {
    id: '1',
    src: '/MP4/wedding主婚1.mp4',
    title: '婚礼时刻1',
    poster: '/wedding/wedding-主婚合影.jpg',
    isMain: true // 标记为主视频
  },
  {
    id: '2',
    src: '/MP4/wedding主婚2.mp4',
    title: '婚礼时刻2',
    poster: '/wedding/wedding-主婚合影2.jpg',
    isMain: false
  },
  {
    id: '3',
    src: '/MP4/wedding主婚3.mp4',
    title: '婚礼时刻3',
    poster: '/wedding/Bride-主纱1.jpg',
    isMain: false
  },
  {
    id: '4',
    src: '/MP4/wedding主婚4.mp4',
    title: '婚礼时刻4',
    poster: '/wedding/Bride-主纱2.jpg',
    isMain: false
  },
  {
    id: '5',
    src: '/MP4/wedding主婚5.mp4',
    title: '婚礼时刻5',
    poster: '/wedding/Bride-主纱3.jpg',
    isMain: false
  },
  {
    id: '6',
    src: '/MP4/wedding主婚6.mp4',
    title: '婚礼时刻6',
    poster: '/wedding/Groom主婚单7.jpg',
    isMain: false
  },
  {
    id: '7',
    src: '/MP4/wedding主婚7.mp4',
    title: '婚礼时刻7',
    poster: '/wedding/Groom主婚单9.jpg',
    isMain: false
  },
  {
    id: '8',
    src: '/MP4/wedding主婚8.mp4',
    title: '婚礼时刻8',
    poster: '/wedding/wedding-主婚合影.jpg',
    isMain: false
  },
  {
    id: '9',
    src: '/MP4/wedding主婚9.mp4',
    title: '婚礼时刻9',
    poster: '/wedding/Wedding-document.jpg',
    isMain: false
  },
  {
    id: '10',
    src: '/MP4/wedding主婚10.mp4',
    title: '婚礼时刻10',
    poster: '/wedding/wedding-主婚合影2.jpg',
    isMain: false
  },
  {
    id: '11',
    src: '/MP4/wedding主婚11.mp4',
    title: '婚礼时刻11',
    poster: '/wedding/Bride-主纱1.jpg',
    isMain: false
  },
  {
    id: '12',
    src: '/MP4/wedding主婚12.mp4',
    title: '婚礼时刻12',
    poster: '/wedding/Bride-主纱2.jpg',
    isMain: false
  }
]

export default function VideoShowcase({ variant = 1 }: VideoShowcaseProps) {
  const [videoState, setVideoState] = useState({
    currentMainVideoIndex: 0,
    viewedVideos: new Set<string>() // 跟踪已显示的视频ID，确保不重复
  })
  
  // 实现视频循环播放功能 - 定期更换视频内容
  useEffect(() => {
    // 每30秒自动切换到下一个视频
    const interval = setInterval(() => {
      setVideoState(prev => {
        // 标记当前视频为已查看
        const updatedViewed = new Set(prev.viewedVideos);
        updatedViewed.add(weddingVideos[prev.currentMainVideoIndex].id);
        
        // 如果所有视频都已查看，重置已查看集合
        if (updatedViewed.size >= weddingVideos.length) {
          updatedViewed.clear();
        }
        
        // 查找下一个未查看的主婚视频
        let nextIndex = prev.currentMainVideoIndex;
        for (let i = 1; i <= weddingVideos.length; i++) {
          nextIndex = (prev.currentMainVideoIndex + i) % weddingVideos.length;
          if (!updatedViewed.has(weddingVideos[nextIndex].id)) {
            break;
          }
        }
        
        return {
          currentMainVideoIndex: nextIndex,
          viewedVideos: updatedViewed
        };
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // 获取当前主视频
  const getCurrentMainVideo = () => {
    return weddingVideos[videoState.currentMainVideoIndex];
  }
  
  // 获取不包含当前主视频且未被查看的其他视频
  const getOtherVideos = () => {
    return weddingVideos
      .filter(video => 
        video.id !== weddingVideos[videoState.currentMainVideoIndex].id &&
        !videoState.viewedVideos.has(video.id)
      );
  }

  // 三种不同布局样式
  
  // 样式1：左右布局，2个视频
  if (variant === 1) {
    const mainVideo = getCurrentMainVideo();
    const otherVideos = getOtherVideos();
    
    return (
      <section className="py-20 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              📹 婚礼视频集锦
            </h2>
            <p className="text-muted-foreground">记录我们最珍贵的瞬间</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <VideoPlayer
              src={mainVideo.src}
              poster={mainVideo.poster}
              title={mainVideo.title}
              variant="default"
              autoPlay={true}
              loop={true}
              muted={false} // 主视频区域有声播放
              isMainVideo={true}
              className="aspect-[9/16] md:aspect-[4/5] w-full object-contain h-full" // 竖屏显示，全页面
            />
            {otherVideos[0] && (
              <VideoPlayer
                src={otherVideos[0].src}
                poster={otherVideos[0].poster}
                title={otherVideos[0].title}
                variant="default"
                autoPlay={true}
                loop={true}
                muted={true} // 非主视频区域静音播放
                isMainVideo={false}
                className="aspect-[9/16] md:aspect-[4/5] w-full object-contain" // 竖屏显示
              />
            )}
          </div>
        </motion.div>
      </section>
    )
  }

  // 样式2：卡片式，3个视频
  if (variant === 2) {
    const otherVideos = getOtherVideos();
    
    return (
      <section className="py-20 px-4 md:px-8 bg-linear-to-br from-graphite/50 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              💖 爱的回忆
            </h2>
            <p className="text-muted-foreground">每一帧都是永恒</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherVideos.slice(0, 3).map((video) => (
              <VideoPlayer
                key={video.id}
                src={video.src}
                poster={video.poster}
                title={video.title}
                variant="card"
                autoPlay={true}
                loop={true}
                muted={true} // 非主视频区域静音播放
                isMainVideo={false}
                className="aspect-[9/16] w-full object-contain" // 竖屏显示
              />
            ))}
          </div>
        </motion.div>
      </section>
    )
  }

  // 样式3：大屏展示 + 缩略图，4个视频
  const mainVideo = getCurrentMainVideo();
  const otherVideos = getOtherVideos();
  
  return (
    <section className="py-20 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            🎬 精彩片段
          </h2>
          <p className="text-muted-foreground">从相识到相守的美好时光</p>
        </div>

        {/* 主视频 */}
        <div className="mb-8">
          <VideoPlayer
            src={mainVideo.src}
            poster={mainVideo.poster}
            title={mainVideo.title}
            variant="default"
            autoPlay={true}
            loop={true}
            muted={false} // 主视频区域有声播放
            isMainVideo={true}
            className="aspect-[9/16] md:aspect-[4/5] w-full max-w-4xl mx-auto object-contain h-full" // 竖屏显示，全页面
          />
        </div>

        {/* 缩略视频 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherVideos.slice(0, 3).map((video) => (
            <VideoPlayer
                key={video.id}
                src={video.src}
                poster={video.poster}
                title={video.title}
                variant="minimal"
                autoPlay={true}
                loop={true}
                muted={true} // 非主视频区域静音播放
                isMainVideo={false}
                className="aspect-[9/16] w-full object-contain" // 竖屏显示
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}


