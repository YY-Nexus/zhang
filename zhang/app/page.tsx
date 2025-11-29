import { redirect } from 'next/navigation'

/**
 * @file 根页面
 * @description 重定向到首页路由
 * @author YYC
 * @version 1.0.0
 */
export default function RootPage() {
  // 重定向到首页路由
  redirect('/home')
}
