/**
 * Design Tokens 设计系统（任务卡 09）
 * 颜色、间距、字体、阴影、圆角等设计令牌
 */

// ============================================
// 1. 颜色系统
// ============================================

export const colors = {
  // 主色调 - 暖金
  gold: {
    DEFAULT: "#D4AF37",
    light: "#E8C864",
    dark: "#B8962E",
    muted: "rgba(212, 175, 55, 0.1)",
  },
  // 辅助色 - 石墨灰
  graphite: {
    DEFAULT: "#2D3436",
    light: "#3D4648",
    dark: "#1D2324",
  },
  // 中性色
  cream: {
    DEFAULT: "#FAF8F5",
    warm: "#F5F0E8",
  },
  // 语义色
  semantic: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
} as const

// ============================================
// 2. 间距系统（基于 4px 网格）
// ============================================

export const spacing = {
  px: "1px",
  0: "0",
  0.5: "2px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
  32: "128px",
} as const

// ============================================
// 3. 字体系统
// ============================================

export const typography = {
  fontFamily: {
    sans: ["Noto Sans SC", "Inter", "system-ui", "sans-serif"],
    serif: ["Noto Serif SC", "Georgia", "serif"],
    mono: ["JetBrains Mono", "Consolas", "monospace"],
    display: ["Playfair Display", "serif"],
  },
  fontSize: {
    xs: ["12px", { lineHeight: "16px" }],
    sm: ["14px", { lineHeight: "20px" }],
    base: ["16px", { lineHeight: "24px" }],
    lg: ["18px", { lineHeight: "28px" }],
    xl: ["20px", { lineHeight: "28px" }],
    "2xl": ["24px", { lineHeight: "32px" }],
    "3xl": ["30px", { lineHeight: "36px" }],
    "4xl": ["36px", { lineHeight: "40px" }],
    "5xl": ["48px", { lineHeight: "1" }],
    "6xl": ["60px", { lineHeight: "1" }],
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const

// ============================================
// 4. 阴影系统
// ============================================

export const shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  // 品牌阴影
  gold: "0 4px 14px 0 rgba(212, 175, 55, 0.25)",
  "gold-lg": "0 10px 25px -3px rgba(212, 175, 55, 0.3)",
  // 弹窗阴影
  modal: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.1)",
  // 卡片悬浮阴影
  cardHover: "0 20px 40px -15px rgba(212, 175, 55, 0.15)",
} as const

// ============================================
// 5. 圆角系统
// ============================================

export const borderRadius = {
  none: "0",
  sm: "4px",
  DEFAULT: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "32px",
  full: "9999px",
} as const

// ============================================
// 6. 断点系统
// ============================================

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const

// ============================================
// 7. 层级系统
// ============================================

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  backdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
  ai: 90,
  max: 100,
} as const

// ============================================
// 8. 过渡系统
// ============================================

export const transitions = {
  fast: "150ms ease-out",
  normal: "300ms ease-in-out",
  slow: "500ms ease-in-out",
  spring: "500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const

// ============================================
// 9. 暗色/高对比模式
// ============================================

export const darkModeColors = {
  background: "#1A1A1A",
  foreground: "#FAFAFA",
  card: "#262626",
  border: "#404040",
  muted: "#A3A3A3",
  gold: "#E8C864", // 暗色模式下金色更亮
} as const

export const highContrastColors = {
  background: "#000000",
  foreground: "#FFFFFF",
  gold: "#FFD700",
  border: "#FFFFFF",
} as const

// ============================================
// 10. CSS 变量输出
// ============================================

export const cssVariables = `
:root {
  /* 颜色 */
  --color-gold: 212 175 55;
  --color-gold-light: 232 200 100;
  --color-gold-dark: 184 150 46;
  --color-graphite: 45 52 54;
  --color-graphite-light: 61 70 72;
  --color-cream: 250 248 245;

  /* 间距 */
  --spacing-unit: 4px;

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* 阴影 */
  --shadow-gold: 0 4px 14px 0 rgba(212, 175, 55, 0.25);
  --shadow-modal: 0 25px 50px -12px rgba(0, 0, 0, 0.4);

  /* 过渡 */
  --transition-fast: 150ms ease-out;
  --transition-normal: 300ms ease-in-out;
  --transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dark {
  --color-background: 26 26 26;
  --color-foreground: 250 250 250;
  --color-card: 38 38 38;
  --color-border: 64 64 64;
}

@media (prefers-contrast: high) {
  :root {
    --color-gold: 255 215 0;
    --color-background: 0 0 0;
    --color-foreground: 255 255 255;
  }
}
`
