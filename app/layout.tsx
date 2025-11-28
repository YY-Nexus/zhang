import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "张波 & 邓芮 💒 婚礼邀请函",
  description: "诚挚邀请您参加张波与邓芮的婚礼，分享我们的幸福与喜悦！2025年11月29日，洛阳孟津富豪大酒店",
  keywords: ["婚礼", "张波", "邓芮", "洛阳", "婚礼邀请函", "YYC³"],
  authors: [{ name: "张波 & 邓芮" }, { name: "YYC³ Team", url: "https://github.com/YY-Nexus" }],
  openGraph: {
    title: "张波 & 邓芮 婚礼邀请函",
    description: "诚挚邀请您参加我们的婚礼，分享幸福与喜悦！",
    type: "website",
    url: "https://zhang.0379.love",
    siteName: "张波 & 邓芮 婚礼邀请函",
    images: [
      {
        url: "https://zhang.0379.love/wedding/Wedding-document.jpg",
        width: 1200,
        height: 630,
        alt: "张波 & 邓芮 婚礼合影",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "张波 & 邓芮 婚礼邀请函",
    description: "诚挚邀请您参加我们的婚礼，分享幸福与喜悦！",
    images: ["https://zhang.0379.love/wedding/Wedding-document.jpg"],
  },
  icons: {
    icon: '/yyc3-pwa-icon.png',
    shortcut: '/yyc3-pwa-icon.png',
    apple: '/yyc3-pwa-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: "#D4AF37",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('[SW] Registration successful:', registration.scope);
                    },
                    function(err) {
                      console.log('[SW] Registration failed:', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased touch-manipulation">
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
