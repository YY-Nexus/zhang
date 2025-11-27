"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Send, Check, Play, Pause, Upload, Download, RotateCcw, Shuffle, X, Gift, Gamepad2, Trophy, Camera, Music, Sparkles, Star } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

interface Game {
  id: string
  title: string
  emoji: string
  description: string
  icon: typeof Heart
  bgColor: string
}

const games: Game[] = [
  {
    id: "guess-couple",
    title: "猜猜新人",
    emoji: "❤️",
    description: "根据提示猜新人的小秘密",
    icon: Heart,
    bgColor: "from-pink-500/20 to-rose-500/20",
  },
  {
    id: "blessing-wall",
    title: "祝福墙",
    emoji: "🎉",
    description: "在祝福墙上留下美好寄语",
    icon: Gift,
    bgColor: "from-gold/20 to-yellow-500/20",
  },
  {
    id: "photo-booth",
    title: "拍照打卡",
    emoji: "📸",
    description: "上传照片添加婚礼特效",
    icon: Camera,
    bgColor: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "music-quiz",
    title: "音乐竞猜",
    emoji: "🎵",
    description: "猜歌名赢小礼品",
    icon: Music,
    bgColor: "from-purple-500/20 to-indigo-500/20",
  },
  {
    id: "love-story",
    title: "爱情故事",
    emoji: "💕",
    description: "了解新人的恋爱历程",
    icon: Sparkles,
    bgColor: "from-red-500/20 to-pink-500/20",
  },
  {
    id: "lucky-draw",
    title: "幸运抽奖",
    emoji: "🎁",
    description: "参与抽奖赢精美礼品",
    icon: Trophy,
    bgColor: "from-green-500/20 to-emerald-500/20",
  },
]

// 1. 猜猜新人游戏
const GuessCouple = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const questions = [
    {
      question: "新郎和新娘是在哪里认识的？",
      options: ["大学校园", "朋友聚会", "工作单位", "网络平台"],
      correct: 1,
      explanation: "他们在一次朋友聚会上一见钟情！",
    },
    {
      question: "他们在一起多少年了？",
      options: ["2年", "3年", "5年", "7年"],
      correct: 2,
      explanation: "恋爱5年，感情深厚！",
    },
    {
      question: "新郎的求婚地点是？",
      options: ["海边", "山顶", "餐厅", "家里"],
      correct: 0,
      explanation: "在浪漫的海边日落时刻求婚！",
    },
    {
      question: "新娘最喜欢的花是？",
      options: ["玫瑰", "百合", "向日葵", "郁金香"],
      correct: 2,
      explanation: "向日葵代表着阳光和希望！",
    },
    {
      question: "他们第一次旅行去的哪里？",
      options: ["云南", "三亚", "西藏", "北京"],
      correct: 0,
      explanation: "云南的浪漫之旅让他们更加深爱彼此！",
    },
  ]

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex)
    setShowExplanation(true)
    
    if (optionIndex === questions[currentQuestion].correct) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowExplanation(false)
      } else {
        setShowResult(true)
      }
    }, 2000)
  }

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <Trophy className="w-20 h-20 text-gold mx-auto mb-4" />
        <h3 className="text-3xl font-bold text-foreground mb-2">
          恭喜完成！
        </h3>
        <p className="text-xl text-muted-foreground mb-4">
          您答对了 <span className="text-gold font-bold">{score}</span> / {questions.length} 题
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          {score === questions.length
            ? "🎉 太棒了！您一定和新人很熟！"
            : score >= questions.length / 2
              ? "👍 不错哦！对新人还挺了解的！"
              : "💪 继续加油！多了解新人的故事吧！"}
        </p>
        <Button
          onClick={() => {
            setCurrentQuestion(0)
            setScore(0)
            setShowResult(false)
            setSelectedAnswer(null)
            setShowExplanation(false)
          }}
          className="bg-gold text-graphite hover:bg-gold/90"
        >
          再玩一次
        </Button>
      </motion.div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          问题 {currentQuestion + 1} / {questions.length}
        </span>
        <span className="text-sm text-gold font-medium">
          得分: {score}
        </span>
      </div>

      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <h4 className="text-xl font-semibold text-foreground mb-6">
          {question.question}
        </h4>

        <div className="grid grid-cols-1 gap-3 mb-4">
          {question.options.map((option, index) => {
            const isCorrect = index === question.correct
            const isSelected = selectedAnswer === index
            const showFeedback = showExplanation && isSelected

            return (
              <motion.button
                key={index}
                whileHover={!showExplanation ? { scale: 1.02 } : {}}
                whileTap={!showExplanation ? { scale: 0.98 } : {}}
                onClick={() => !showExplanation && handleAnswer(index)}
                disabled={showExplanation}
                className={`p-4 border rounded-xl text-left transition-all ${
                  showFeedback
                    ? isCorrect
                      ? "bg-green-500/20 border-green-500"
                      : "bg-red-500/20 border-red-500"
                    : "bg-card hover:bg-gold/10 border-border hover:border-gold"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-foreground">{option}</span>
                  {showFeedback && (
                    <span className="text-2xl">
                      {isCorrect ? "✅" : "❌"}
                    </span>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gold/10 border border-gold/30 rounded-lg"
          >
            <p className="text-sm text-foreground">💡 {question.explanation}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

// 2. 祝福墙
const BlessingWall = () => {
  const [blessings, setBlessings] = useState([
    { id: 1, name: "张三", message: "祝新人百年好合，永结同心！", time: "5分钟前", likes: 12 },
    { id: 2, name: "李四", message: "看到你们的幸福，我也很开心！新婚快乐！🎉", time: "10分钟前", likes: 8 },
    { id: 3, name: "王五", message: "愿你们的爱情像美酒一样越陈越香！", time: "15分钟前", likes: 15 },
    { id: 4, name: "赵六", message: "执子之手，与子偕老。祝福新人！💕", time: "20分钟前", likes: 20 },
  ])
  const [newBlessing, setNewBlessing] = useState({ name: "", message: "" })
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newBlessing.name && newBlessing.message) {
      const blessing = {
        id: Date.now(),
        name: newBlessing.name,
        message: newBlessing.message,
        time: "刚刚",
        likes: 0,
      }
      setBlessings([blessing, ...blessings])
      setNewBlessing({ name: "", message: "" })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  const handleLike = (id: number) => {
    setBlessings(blessings.map(b => 
      b.id === id ? { ...b, likes: b.likes + 1 } : b
    ))
  }

  return (
    <div className="p-6 max-h-[600px] overflow-y-auto">
      {/* 发送祝福表单 */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-card/50 rounded-xl border border-border">
        <h4 className="text-lg font-semibold text-foreground mb-4">✍️ 写下您的祝福</h4>
        <Input
          placeholder="您的名字"
          value={newBlessing.name}
          onChange={(e) => setNewBlessing({ ...newBlessing, name: e.target.value })}
          className="mb-3"
          required
        />
        <Textarea
          placeholder="送上您最真挚的祝福..."
          value={newBlessing.message}
          onChange={(e) => setNewBlessing({ ...newBlessing, message: e.target.value })}
          className="mb-3 min-h-[100px]"
          required
        />
        <Button type="submit" className="w-full bg-gold text-graphite hover:bg-gold/90">
          <Send className="w-4 h-4 mr-2" />
          发送祝福
        </Button>
      </form>

      {/* 成功提示 */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg flex items-center"
          >
            <Check className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-500">祝福发送成功！</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 祝福列表 */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-foreground mb-4">💌 祝福留言板</h4>
        {blessings.map((blessing, index) => (
          <motion.div
            key={blessing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 bg-card/50 rounded-xl border border-border hover:border-gold/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/30 to-purple-500/30 flex items-center justify-center text-lg">
                  {blessing.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{blessing.name}</p>
                  <p className="text-xs text-muted-foreground">{blessing.time}</p>
                </div>
              </div>
              <button
                onClick={() => handleLike(blessing.id)}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors"
              >
                <Heart className="w-4 h-4 text-gold" />
                <span className="text-sm text-gold">{blessing.likes}</span>
              </button>
            </div>
            <p className="text-foreground ml-12">{blessing.message}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// 3. 拍照打卡
const PhotoBooth = () => {
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [selectedFrame, setSelectedFrame] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const frames = [
    { id: 0, name: "经典婚礼", border: "border-8 border-gold shadow-2xl" },
    { id: 1, name: "浪漫粉色", border: "border-8 border-pink-400 shadow-2xl shadow-pink-500/50" },
    { id: 2, name: "清新绿色", border: "border-8 border-emerald-400 shadow-2xl shadow-emerald-500/50" },
    { id: 3, name: "优雅紫色", border: "border-8 border-purple-400 shadow-2xl shadow-purple-500/50" },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDownload = () => {
    if (uploadedPhoto) {
      const link = document.createElement('a')
      link.href = uploadedPhoto
      link.download = `wedding-photo-${Date.now()}.jpg`
      link.click()
    }
  }

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h4 className="text-lg font-semibold text-foreground mb-2">📸 上传照片添加婚礼边框</h4>
        <p className="text-sm text-muted-foreground">选择您喜欢的相框，留下美好回忆</p>
      </div>

      {/* 上传区域 */}
      {!uploadedPhoto ? (
        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-12 border-2 border-dashed border-border hover:border-gold rounded-xl bg-card/30 hover:bg-card/50 transition-all"
          >
            <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium mb-2">点击上传照片</p>
            <p className="text-sm text-muted-foreground">支持 JPG、PNG 格式</p>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 照片预览 */}
          <div className="flex justify-center">
            <motion.div
              key={selectedFrame}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`relative ${frames[selectedFrame].border} rounded-lg overflow-hidden`}
            >
              <Image
                src={uploadedPhoto}
                alt="Uploaded photo"
                width={400}
                height={400}
                className="w-full h-auto max-w-md object-cover"
              />
              <div className="absolute top-4 left-4 right-4 text-center">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg py-2 px-4 inline-block">
                  <p className="text-gold font-bold text-lg">张波 ❤️ 邓芮</p>
                  <p className="text-white text-sm">2025.11.29</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 相框选择 */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">选择相框样式：</p>
            <div className="grid grid-cols-4 gap-3">
              {frames.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedFrame === frame.id
                      ? "border-gold bg-gold/10"
                      : "border-border bg-card hover:border-gold/50"
                  }`}
                >
                  <div className={`w-full h-12 rounded ${frame.border.split(' ')[1]} ${frame.border.split(' ')[2]}`}></div>
                  <p className="text-xs text-foreground mt-2">{frame.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <Button
              onClick={handleDownload}
              className="flex-1 bg-gold text-graphite hover:bg-gold/90"
            >
              <Download className="w-4 h-4 mr-2" />
              下载照片
            </Button>
            <Button
              onClick={() => setUploadedPhoto(null)}
              variant="outline"
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              重新上传
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// 4. 音乐竞猜
const MusicQuiz = () => {
  const [currentSong, setCurrentSong] = useState(0)
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [answered, setAnswered] = useState(false)

  const songs = [
    {
      id: 1,
      hint: "🎵 邓丽君经典情歌，月亮代表我的心...",
      options: ["月亮代表我的心", "甜蜜蜜", "我只在乎你", "但愿人长久"],
      correct: 0,
    },
    {
      id: 2,
      hint: "🎶 周杰伦婚礼必备曲目，最浪漫的事...",
      options: ["告白气球", "简单爱", "晴天", "七里香"],
      correct: 0,
    },
    {
      id: 3,
      hint: "🎵 梁静茹的勇气之歌...",
      options: ["勇气", "暖暖", "宁夏", "分手快乐"],
      correct: 0,
    },
    {
      id: 4,
      hint: "🎶 陈奕迅深情歌曲，十年之约...",
      options: ["十年", "K歌之王", "富士山下", "爱情转移"],
      correct: 0,
    },
  ]

  const handleAnswer = (optionIndex: number) => {
    if (answered) return
    
    setAnswered(true)
    if (optionIndex === songs[currentSong].correct) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentSong < songs.length - 1) {
        setCurrentSong(currentSong + 1)
        setAnswered(false)
        setIsPlaying(false)
      } else {
        setShowResult(true)
      }
    }, 1500)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <Music className="w-20 h-20 text-gold mx-auto mb-4" />
        <h3 className="text-3xl font-bold text-foreground mb-2">
          竞猜完成！
        </h3>
        <p className="text-xl text-muted-foreground mb-4">
          您答对了 <span className="text-gold font-bold">{score}</span> / {songs.length} 首
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          {score === songs.length
            ? "🎉 音乐大师！所有歌曲都猜对了！"
            : score >= songs.length / 2
              ? "👍 不错的音乐品味！"
              : "💪 多听听经典老歌吧！"}
        </p>
        <Button
          onClick={() => {
            setCurrentSong(0)
            setScore(0)
            setShowResult(false)
            setAnswered(false)
            setIsPlaying(false)
          }}
          className="bg-gold text-graphite hover:bg-gold/90"
        >
          再玩一次
        </Button>
      </motion.div>
    )
  }

  const song = songs[currentSong]

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          歌曲 {currentSong + 1} / {songs.length}
        </span>
        <span className="text-sm text-gold font-medium">
          得分: {score}
        </span>
      </div>

      <motion.div
        key={currentSong}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {/* 播放器 */}
        <div className="mb-8 p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-border">
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-gold to-purple-500 flex items-center justify-center"
            >
              <Music className="w-12 h-12 text-white" />
            </motion.div>
          </div>
          
          <button
            onClick={handlePlayPause}
            className="w-full py-3 bg-gold hover:bg-gold/90 text-graphite font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                暂停播放
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                播放提示音
              </>
            )}
          </button>
        </div>

        {/* 提示 */}
        <div className="mb-6 p-4 bg-card/50 rounded-lg border border-border">
          <p className="text-lg text-foreground text-center">{song.hint}</p>
        </div>

        {/* 选项 */}
        <h4 className="text-sm font-medium text-foreground mb-3">请选择歌名：</h4>
        <div className="grid grid-cols-1 gap-3">
          {song.options.map((option, index) => {
            const isCorrect = index === song.correct
            const isSelected = answered && index === song.correct

            return (
              <motion.button
                key={index}
                whileHover={!answered ? { scale: 1.02 } : {}}
                whileTap={!answered ? { scale: 0.98 } : {}}
                onClick={() => handleAnswer(index)}
                disabled={answered}
                className={`p-4 border rounded-xl text-left transition-all ${
                  isSelected
                    ? "bg-green-500/20 border-green-500"
                    : "bg-card hover:bg-gold/10 border-border hover:border-gold"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-foreground">{option}</span>
                  {isSelected && <span className="text-2xl">✅</span>}
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

// 5. 爱情故事时间线
const LoveStory = () => {
  const timeline = [
    {
      year: "2018",
      title: "初次相遇",
      description: "在朋友的生日聚会上，我们第一次见面。你的笑容让我怦然心动。",
      emoji: "💫",
      color: "from-pink-500/20 to-rose-500/20",
    },
    {
      year: "2019",
      title: "确定关系",
      description: "春天的樱花树下,我鼓起勇气向你表白，你说愿意给我们一个机会。",
      emoji: "🌸",
      color: "from-red-500/20 to-pink-500/20",
    },
    {
      year: "2020",
      title: "第一次旅行",
      description: "我们一起去云南旅行，在洱海边看日出，在丽江古城漫步。",
      emoji: "✈️",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      year: "2021",
      title: "见家长",
      description: "第一次见双方父母，得到了家人的祝福，我们的关系更加稳定。",
      emoji: "👨‍👩‍👧‍👦",
      color: "from-orange-500/20 to-yellow-500/20",
    },
    {
      year: "2022",
      title: "共同成长",
      description: "我们一起经历工作的挑战，相互支持，共同成长，感情更加深厚。",
      emoji: "💪",
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      year: "2023",
      title: "浪漫求婚",
      description: "在海边的日落时刻，我单膝下跪，向你求婚。你含泪答应了！",
      emoji: "💍",
      color: "from-purple-500/20 to-indigo-500/20",
    },
    {
      year: "2024",
      title: "筹备婚礼",
      description: "我们一起精心筹备婚礼，期待与所有亲朋好友分享我们的幸福。",
      emoji: "💒",
      color: "from-gold/20 to-yellow-500/20",
    },
    {
      year: "2025",
      title: "执手一生",
      description: "今天，我们正式成为夫妻。感谢所有人的见证和祝福！",
      emoji: "💕",
      color: "from-red-500/20 to-pink-500/20",
    },
  ]

  return (
    <div className="p-6 max-h-[600px] overflow-y-auto">
      <div className="text-center mb-8">
        <h4 className="text-2xl font-bold text-foreground mb-2">我们的爱情故事</h4>
        <p className="text-sm text-muted-foreground">从相遇到相守的每一个重要时刻</p>
      </div>

      <div className="relative">
        {/* 时间线 */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-purple-500 to-gold"></div>

        <div className="space-y-8">
          {timeline.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-20"
            >
              {/* 时间点 */}
              <div className="absolute left-0 w-16 h-16 rounded-full bg-gradient-to-br from-gold to-purple-500 flex items-center justify-center text-2xl shadow-lg">
                {event.emoji}
              </div>

              {/* 内容卡片 */}
              <div className={`p-4 rounded-xl bg-gradient-to-br ${event.color} backdrop-blur-sm border border-border`}>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-lg font-bold text-foreground">{event.title}</h5>
                  <span className="text-sm font-medium text-gold">{event.year}</span>
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 6. 幸运抽奖
const LuckyDraw = () => {
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [hasDrawn, setHasDrawn] = useState(false)

  const prizes = [
    { id: 1, name: "特等奖", desc: "精美婚礼相册", emoji: "🏆", probability: 0.05 },
    { id: 2, name: "一等奖", desc: "定制水晶摆件", emoji: "💎", probability: 0.1 },
    { id: 3, name: "二等奖", desc: "高级巧克力礼盒", emoji: "🍫", probability: 0.15 },
    { id: 4, name: "三等奖", desc: "精美红包", emoji: "🧧", probability: 0.2 },
    { id: 5, name: "参与奖", desc: "新人感谢卡", emoji: "💌", probability: 0.5 },
  ]

  const handleSpin = () => {
    if (hasDrawn) return

    setIsSpinning(true)
    setResult(null)

    // 模拟抽奖动画
    setTimeout(() => {
      const random = Math.random()
      let cumulative = 0
      let selectedPrize = prizes[prizes.length - 1]

      for (const prize of prizes) {
        cumulative += prize.probability
        if (random <= cumulative) {
          selectedPrize = prize
          break
        }
      }

      setResult(selectedPrize.name)
      setIsSpinning(false)
      setHasDrawn(true)
    }, 3000)
  }

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h4 className="text-2xl font-bold text-foreground mb-2">🎁 幸运大抽奖</h4>
        <p className="text-sm text-muted-foreground">每位来宾都有一次抽奖机会哦！</p>
      </div>

      {/* 抽奖转盘 */}
      <div className="flex justify-center mb-8">
        <motion.div
          animate={{
            rotate: isSpinning ? 360 * 5 : 0,
            scale: isSpinning ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: isSpinning ? 3 : 0,
            ease: isSpinning ? "easeOut" : "easeInOut",
          }}
          className="relative w-64 h-64 rounded-full bg-gradient-to-br from-gold via-purple-500 to-gold p-1 shadow-2xl"
        >
          <div className="w-full h-full rounded-full bg-graphite flex items-center justify-center">
            {!result ? (
              <Gift className="w-24 h-24 text-gold" />
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-2">
                  {prizes.find(p => p.name === result)?.emoji}
                </div>
                <p className="text-gold font-bold text-xl">{result}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* 抽奖按钮 */}
      {!hasDrawn ? (
        <Button
          onClick={handleSpin}
          disabled={isSpinning}
          className="w-full py-6 text-lg bg-gold text-graphite hover:bg-gold/90 disabled:opacity-50"
        >
          {isSpinning ? (
            <>
              <Shuffle className="w-5 h-5 mr-2 animate-spin" />
              抽奖中...
            </>
          ) : (
            <>
              <Gift className="w-5 h-5 mr-2" />
              点击抽奖
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-gradient-to-br from-gold/20 to-purple-500/20 rounded-xl border-2 border-gold text-center"
          >
            <Trophy className="w-16 h-16 text-gold mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              恭喜您抽中
            </h3>
            <p className="text-3xl font-bold text-gold mb-2">
              {prizes.find(p => p.name === result)?.emoji} {result}
            </p>
            <p className="text-muted-foreground">
              {prizes.find(p => p.name === result)?.desc}
            </p>
          </motion.div>
          <p className="text-center text-sm text-muted-foreground">
            请在婚礼现场凭此页面领取奖品
          </p>
        </div>
      )}

      {/* 奖品列表 */}
      <div className="mt-8 p-4 bg-card/30 rounded-xl border border-border">
        <h5 className="text-sm font-semibold text-foreground mb-3">🎁 奖品清单</h5>
        <div className="space-y-2">
          {prizes.map((prize) => (
            <div key={prize.id} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {prize.emoji} {prize.name}
              </span>
              <span className="text-foreground">{prize.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 主组件
export default function EntertainmentZone() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [totalPoints, setTotalPoints] = useState(0)

  const renderGameContent = () => {
    switch (selectedGame) {
      case "guess-couple":
        return <GuessCouple />
      case "blessing-wall":
        return <BlessingWall />
      case "photo-booth":
        return <PhotoBooth />
      case "music-quiz":
        return <MusicQuiz />
      case "love-story":
        return <LoveStory />
      case "lucky-draw":
        return <LuckyDraw />
      default:
        return null
    }
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-graphite via-purple-900/20 to-graphite overflow-hidden">
      {/* 顶部装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-gold/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* 内容区域 */}
      <div className="relative z-10 flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          {/* 标题 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              🎮 娱乐休闲区
            </h2>
            <p className="text-lg text-muted-foreground">
              玩游戏、留祝福、赢奖品、留下美好回忆
            </p>
            {totalPoints > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-full"
              >
                <Star className="w-5 h-5 text-gold fill-gold" />
                <span className="text-gold font-bold">积分: {totalPoints}</span>
              </motion.div>
            )}
          </motion.div>

          {/* 游戏选择 */}
          {!selectedGame ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game, index) => (
                <motion.button
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedGame(game.id)}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${game.bgColor} backdrop-blur-xl border border-border p-6 text-left group`}
                >
                  <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                    {game.emoji}
                  </div>

                  <game.icon className="w-12 h-12 text-gold mb-4" />

                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {game.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {game.description}
                  </p>

                  <div className="mt-4 flex items-center text-gold text-sm font-medium">
                    开始体验
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="ml-2"
                    >
                      →
                    </motion.span>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto bg-card/80 backdrop-blur-xl rounded-2xl border border-border overflow-hidden shadow-2xl"
            >
              <div className="p-6 bg-gradient-to-r from-gold/20 to-purple-500/20 border-b border-border flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground">
                  {games.find((g) => g.id === selectedGame)?.emoji}{" "}
                  {games.find((g) => g.id === selectedGame)?.title}
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setSelectedGame(null)}
                  className="bg-transparent hover:bg-gold/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  返回
                </Button>
              </div>

              {renderGameContent()}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
