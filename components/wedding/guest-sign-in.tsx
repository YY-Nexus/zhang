"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserCheck, Users, CheckCircle2 } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function GuestSignIn() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    attending: "yes",
    guests: "1",
    meal: "normal",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <section className="relative py-20 md:py-32 bg-secondary/30 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">签到成功！</h2>
            <p className="text-muted-foreground mb-6">感谢您的确认，我们期待在婚礼当天与您相见！💕</p>
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              修改信息
            </Button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-20 md:py-32 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm tracking-widest uppercase">RSVP</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2">来宾签到</h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">请确认您的出席信息，以便我们更好地安排 🎊</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-gold" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">出席确认</h3>
            </div>

            <div className="space-y-6">
              {/* 姓名 */}
              <div>
                <Label htmlFor="name">您的姓名 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="请输入您的姓名"
                  required
                  className="mt-2"
                />
              </div>

              {/* 手机 */}
              <div>
                <Label htmlFor="phone">联系电话 *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="请输入您的手机号"
                  required
                  className="mt-2"
                />
              </div>

              {/* 是否出席 */}
              <div>
                <Label>是否出席 *</Label>
                <RadioGroup
                  value={formData.attending}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, attending: value }))}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes" className="cursor-pointer">
                      欣然出席 🎉
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="cursor-pointer">
                      无法出席 😢
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.attending === "yes" && (
                <>
                  {/* 出席人数 */}
                  <div>
                    <Label>出席人数</Label>
                    <Select
                      value={formData.guests}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, guests: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 人</SelectItem>
                        <SelectItem value="2">2 人</SelectItem>
                        <SelectItem value="3">3 人</SelectItem>
                        <SelectItem value="4">4 人</SelectItem>
                        <SelectItem value="5">5 人以上</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 餐饮偏好 */}
                  <div>
                    <Label>餐饮偏好</Label>
                    <Select
                      value={formData.meal}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, meal: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">正常饮食</SelectItem>
                        <SelectItem value="vegetarian">素食</SelectItem>
                        <SelectItem value="halal">清真</SelectItem>
                        <SelectItem value="allergies">食物过敏（请联系新人）</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold hover:bg-gold-dark text-graphite font-semibold py-6 rounded-xl"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-graphite/30 border-t-graphite rounded-full animate-spin" />
                    提交中...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    确认提交
                  </span>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
