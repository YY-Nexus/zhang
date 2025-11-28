"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Check, Clock, XIcon, Phone, MapPin } from "@/components/icons"
import { Input } from "@/components/ui/input"

// 模拟来宾数据
const mockGuests = [
  { id: 1, name: "李明", relation: "新郎同事", status: "confirmed", guests: 2, phone: "138****1234" },
  { id: 2, name: "王芳", relation: "新娘闺蜜", status: "confirmed", guests: 1, phone: "139****5678" },
  { id: 3, name: "张伟", relation: "大学同学", status: "pending", guests: 3, phone: "137****9012" },
  { id: 4, name: "赵丽", relation: "亲戚", status: "confirmed", guests: 4, phone: "136****3456" },
  { id: 5, name: "刘强", relation: "高中同学", status: "declined", guests: 0, phone: "135****7890" },
  { id: 6, name: "陈静", relation: "同事", status: "confirmed", guests: 2, phone: "134****2345" },
]

const statusConfig = {
  confirmed: { label: "已确认", icon: Check, color: "text-green-500 bg-green-500/10" },
  pending: { label: "待确认", icon: Clock, color: "text-gold bg-gold/10" },
  declined: { label: "已谢绝", icon: XIcon, color: "text-red-400 bg-red-400/10" },
}

export default function GuestListModalContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredGuests = mockGuests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) || guest.relation.includes(searchTerm)
    const matchesStatus = filterStatus === "all" || guest.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockGuests.length,
    confirmed: mockGuests.filter((g) => g.status === "confirmed").length,
    pending: mockGuests.filter((g) => g.status === "pending").length,
    totalGuests: mockGuests.filter((g) => g.status === "confirmed").reduce((sum, g) => sum + g.guests, 0),
  }

  return (
    <div className="p-4 space-y-4">
      {/* 统计概览 */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-gold/10 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-gold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">总邀请</p>
        </div>
        <div className="bg-green-500/10 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-500">{stats.confirmed}</p>
          <p className="text-xs text-muted-foreground">已确认</p>
        </div>
        <div className="bg-gold/10 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-gold">{stats.pending}</p>
          <p className="text-xs text-muted-foreground">待回复</p>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-500">{stats.totalGuests}</p>
          <p className="text-xs text-muted-foreground">预计人数</p>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索来宾..."
            className="pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 rounded-md border border-border bg-background text-sm"
        >
          <option value="all">全部</option>
          <option value="confirmed">已确认</option>
          <option value="pending">待确认</option>
          <option value="declined">已谢绝</option>
        </select>
      </div>

      {/* 来宾列表 */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filteredGuests.map((guest, index) => {
          const status = statusConfig[guest.status as keyof typeof statusConfig]
          const StatusIcon = status.icon

          return (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border hover:border-gold/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-semibold">
                {guest.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{guest.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${status.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{guest.relation}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{guest.guests} 人</p>
                <p className="text-xs text-muted-foreground">{guest.phone}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* 快捷操作 */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors text-sm">
          <Phone className="w-4 h-4" />
          批量通知
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors text-sm">
          <MapPin className="w-4 h-4" />
          发送位置
        </button>
      </div>
    </div>
  )
}
