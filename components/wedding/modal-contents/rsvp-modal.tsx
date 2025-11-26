"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, User, Phone, Utensils, Armchair } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 座位区域
const seatAreas = [
  { id: "vip", name: "主桌区", desc: "靠近主舞台", available: 2 },
  { id: "family", name: "亲友区", desc: "家族亲属席", available: 8 },
  { id: "friend", name: "好友区", desc: "朋友同事席", available: 15 },
  { id: "general", name: "普通区", desc: "自由座位", available: 30 },
]

export default function RSVPModalContent() {
  const [step, setStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    attending: "yes",
    guests: "1",
    meal: "normal",
    seatArea: "",
    specialRequest: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </motion.div>
        <h3 className="text-xl font-bold text-foreground mb-2">签到成功！</h3>
        <p className="text-muted-foreground mb-4">
          感谢您的确认，{formData.name}！
          <br />
          我们期待在婚礼当天与您相见。
        </p>
        <div className="bg-gold/10 rounded-lg p-4 text-sm text-left">
          <p>
            <strong>出席人数：</strong>
            {formData.guests} 人
          </p>
          <p>
            <strong>餐饮偏好：</strong>
            {formData.meal === "normal" ? "正常饮食" : formData.meal}
          </p>
          {formData.seatArea && (
            <p>
              <strong>座位区域：</strong>
              {seatAreas.find((s) => s.id === formData.seatArea)?.name}
            </p>
          )}
        </div>
        <Button
          onClick={() => {
            setIsSubmitted(false)
            setStep(1)
          }}
          variant="outline"
          className="mt-4"
        >
          修改信息
        </Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {/* 步骤指示器 */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step >= s ? "bg-gold text-graphite" : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 3 && <div className={`w-8 h-0.5 ${step > s ? "bg-gold" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* 步骤1：基本信息 */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h4 className="font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-gold" />
              基本信息
            </h4>
            <div>
              <Label>您的姓名 *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="请输入您的姓名"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label>联系电话 *</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="请输入手机号"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <Label>是否出席 *</Label>
              <RadioGroup
                value={formData.attending}
                onValueChange={(v) => setFormData((prev) => ({ ...prev, attending: v }))}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="att-yes" />
                  <Label htmlFor="att-yes">欣然出席</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="att-no" />
                  <Label htmlFor="att-no">无法出席</Label>
                </div>
              </RadioGroup>
            </div>
            <Button
              type="button"
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.phone}
              className="w-full bg-gold text-graphite hover:bg-gold/90"
            >
              下一步
            </Button>
          </motion.div>
        )}

        {/* 步骤2：餐饮偏好 */}
        {step === 2 && formData.attending === "yes" && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h4 className="font-semibold flex items-center gap-2">
              <Utensils className="w-5 h-5 text-gold" />
              餐饮偏好
            </h4>
            <div>
              <Label>出席人数</Label>
              <Select value={formData.guests} onValueChange={(v) => setFormData((prev) => ({ ...prev, guests: v }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} 人
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>餐饮要求</Label>
              <Select value={formData.meal} onValueChange={(v) => setFormData((prev) => ({ ...prev, meal: v }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">正常饮食</SelectItem>
                  <SelectItem value="vegetarian">素食</SelectItem>
                  <SelectItem value="halal">清真</SelectItem>
                  <SelectItem value="allergies">食物过敏</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                上一步
              </Button>
              <Button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 bg-gold text-graphite hover:bg-gold/90"
              >
                下一步
              </Button>
            </div>
          </motion.div>
        )}

        {/* 步骤3：座位选择 */}
        {step === 3 && formData.attending === "yes" && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h4 className="font-semibold flex items-center gap-2">
              <Armchair className="w-5 h-5 text-gold" />
              座位偏好
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {seatAreas.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, seatArea: area.id }))}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    formData.seatArea === area.id ? "border-gold bg-gold/10" : "border-border hover:border-gold/50"
                  }`}
                >
                  <p className="font-medium text-sm">{area.name}</p>
                  <p className="text-xs text-muted-foreground">{area.desc}</p>
                  <p className="text-xs text-gold mt-1">剩余 {area.available} 席</p>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                上一步
              </Button>
              <Button type="submit" className="flex-1 bg-gold text-graphite hover:bg-gold/90">
                确认提交
              </Button>
            </div>
          </motion.div>
        )}

        {/* 无法出席 */}
        {step === 2 && formData.attending === "no" && (
          <motion.div
            key="step2-no"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center py-6"
          >
            <p className="text-muted-foreground mb-4">
              很遗憾您无法出席，感谢您的告知。
              <br />
              您的祝福对我们同样重要！
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                返回
              </Button>
              <Button type="submit" className="flex-1 bg-gold text-graphite">
                发送祝福
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
