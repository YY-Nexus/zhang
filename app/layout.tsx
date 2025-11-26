import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "张波 & 邓芮 💒 婚礼邀请函",
  description: "诚挚邀请您参加张波与邓芮的婚礼，分享我们的幸福与喜悦！2025年11月29日，洛阳孟津富豪大酒店",
  keywords: ["婚礼", "张波", "邓芮", "洛阳", "婚礼邀请函"],
  authors: [{ name: "张波 & 邓芮" }],
  openGraph: {
    title: "张波 & 邓芮 婚礼邀请函",
    description: "诚挚邀请您参加我们的婚礼，分享幸福与喜悦！",
    type: "website",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#D4AF37",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
