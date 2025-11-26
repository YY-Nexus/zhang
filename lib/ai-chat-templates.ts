/**
 * 婚礼AI助手对话模板
 * 包含开场话术和快捷任务
 */

export interface ChatTemplate {
  greetings: string[]
  shortcuts: Shortcut[]
}

export interface Shortcut {
  label: string
  command: string
  emoji: string
}

export const chatTemplates: ChatTemplate = {
  greetings: [
    "🎊 欢迎来到张波&邓芮的婚礼！",
    "💒 恭喜您收到喜帖，期待相见！",
    "🌹 您好！我是婚礼小助手～",
    "✨ 感谢莅临，有什么可以帮您？",
    "🎉 欢迎贵宾，婚礼即将开始！",
    "💕 祝福新人，也欢迎您的到来！",
  ],
  shortcuts: [
    { label: "导航到会场", command: "navigate_to_venue", emoji: "📍" },
    { label: "来宾签到", command: "guest_checkin", emoji: "✅" },
    { label: "播放音乐", command: "play_music", emoji: "🎵" },
    { label: "确认出席", command: "rsvp_confirm", emoji: "📝" },
    { label: "联系新人", command: "contact_couple", emoji: "💌" },
    { label: "一键呼叫", command: "call_contact", emoji: "📞" },
  ],
}

// 导出 JSON 格式供验收
export const chatTemplatesJSON = {
  greetings: [
    "🎊 欢迎来到张波&邓芮的婚礼！",
    "💒 恭喜您收到喜帖，期待相见！",
    "🌹 您好！我是婚礼小助手～",
    "✨ 感谢莅临，有什么可以帮您？",
    "🎉 欢迎贵宾，婚礼即将开始！",
    "💕 祝福新人，也欢迎您的到来！",
  ],
  shortcuts: [
    { label: "导航到会场", command: "navigate_to_venue" },
    { label: "来宾签到", command: "guest_checkin" },
    { label: "播放音乐", command: "play_music" },
    { label: "确认出席", command: "rsvp_confirm" },
    { label: "联系新人", command: "contact_couple" },
    { label: "一键呼叫", command: "call_contact" },
  ],
}
