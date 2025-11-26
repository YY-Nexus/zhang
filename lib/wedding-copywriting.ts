/**
 * 提示词 H：中文婚礼文案与表情包
 * 三套欢迎文案：现代温暖、传统庄重、轻松活泼
 * 每套包含洛阳习俗提示（敬茶/迎亲）
 */

export interface WelcomeCopy {
  style: "modern" | "traditional" | "casual"
  styleName: string
  lines: string[]
  customTip: string
}

export const welcomeCopysets: WelcomeCopy[] = [
  {
    style: "modern",
    styleName: "现代温暖",
    lines: [
      "💕 爱情是一场奇妙的旅程，感谢你见证我们的起点",
      "✨ 2025.11.29，我们将在洛阳许下一生的承诺",
      "🌹 期待与你共同分享这份幸福与感动",
    ],
    customTip: "🍵 洛阳习俗提示：敬茶环节将于上午10:30进行，新人向双方父母敬茶以表孝心",
  },
  {
    style: "traditional",
    styleName: "传统庄重",
    lines: [
      "🎎 良缘天定，佳偶天成，诚邀阁下拨冗出席",
      "📜 谨定于公历2025年11月29日（农历十月初十）举行婚礼",
      "🏮 恭候光临，共襄盛举，同贺新禧",
    ],
    customTip: "🎊 洛阳习俗提示：迎亲队伍将于早8:00出发，届时鸣炮奏乐，喜迎新娘",
  },
  {
    style: "casual",
    styleName: "轻松活泼",
    lines: [
      "🎉 嘿！我们要结婚啦～快来一起嗨！",
      "💒 11月29日洛阳孟津，好吃好喝等你来！",
      "📸 记得带上你的祝福和美美的自己哦～",
    ],
    customTip: "☕ 洛阳习俗提示：敬茶时记得说吉祥话，新人会给长辈敬上香茶表心意",
  },
]

// 获取指定风格的文案
export function getCopyByStyle(style: WelcomeCopy["style"]): WelcomeCopy | undefined {
  return welcomeCopysets.find((copy) => copy.style === style)
}

// 获取随机文案
export function getRandomCopy(): WelcomeCopy {
  return welcomeCopysets[Math.floor(Math.random() * welcomeCopysets.length)]
}

// Markdown 格式输出（供验收使用）
export const welcomeCopyMarkdown = `
## 婚礼欢迎文案

### 一、现代温暖风格

💕 爱情是一场奇妙的旅程，感谢你见证我们的起点
✨ 2025.11.29，我们将在洛阳许下一生的承诺
🌹 期待与你共同分享这份幸福与感动

> 🍵 洛阳习俗提示：**敬茶**环节将于上午10:30进行，新人向双方父母敬茶以表孝心

---

### 二、传统庄重风格

🎎 良缘天定，佳偶天成，诚邀阁下拨冗出席
📜 谨定于公历2025年11月29日（农历十月初十）举行婚礼
🏮 恭候光临，共襄盛举，同贺新禧

> 🎊 洛阳习俗提示：**迎亲**队伍将于早8:00出发，届时鸣炮奏乐，喜迎新娘

---

### 三、轻松活泼风格

🎉 嘿！我们要结婚啦～快来一起嗨！
💒 11月29日洛阳孟津，好吃好喝等你来！
📸 记得带上你的祝福和美美的自己哦～

> ☕ 洛阳习俗提示：**敬茶**时记得说吉祥话，新人会给长辈敬上香茶表心意
`
