/**
 * 导航和电话工具函数
 * 支持多平台：iOS、Android、桌面端
 * 支持多地图：Apple Maps、Google Maps、高德地图、百度地图、腾讯地图
 */

// 检测设备类型
export function detectDevice(): 'ios' | 'android' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  
  const ua = navigator.userAgent.toLowerCase()
  
  if (/iphone|ipad|ipod/.test(ua)) {
    return 'ios'
  }
  
  if (/android/.test(ua)) {
    return 'android'
  }
  
  return 'desktop'
}

// 检测是否在移动设备上
export function isMobile(): boolean {
  return detectDevice() !== 'desktop'
}

// 婚礼场地信息
export const venueInfo = {
  name: '富豪大酒店(阿新大道店)',
  address: '河南省洛阳市孟津区将军路57号',
  // 坐标（百度/高德坐标系）
  latitude: 34.735724,
  longitude: 112.367931,
  // 坐标（GPS坐标系，用于Google Maps）
  gpsLatitude: 34.735724,
  gpsLongitude: 112.367931,
}

/**
 * 打开导航（自动选择最佳地图应用）
 */
export function openNavigation() {
  const device = detectDevice()
  
  if (device === 'ios') {
    // iOS优先使用Apple Maps
    const url = `https://maps.apple.com/?daddr=${venueInfo.latitude},${venueInfo.longitude}&dirflg=d`
    window.open(url, '_blank')
  } else if (device === 'android') {
    // Android优先使用高德地图，如果没有则使用Google Maps
    const amapUrl = `androidamap://navi?sourceApplication=wedding&lat=${venueInfo.latitude}&lon=${venueInfo.longitude}&dev=0&style=2`
    const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${venueInfo.gpsLatitude},${venueInfo.gpsLongitude}`
    
    // 尝试打开高德地图
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = amapUrl
    document.body.appendChild(iframe)
    
    setTimeout(() => {
      document.body.removeChild(iframe)
      // 如果高德地图没打开，使用Google Maps
      window.open(googleUrl, '_blank')
    }, 500)
  } else {
    // 桌面端使用Google Maps
    const url = `https://www.google.com/maps/dir/?api=1&destination=${venueInfo.gpsLatitude},${venueInfo.gpsLongitude}`
    window.open(url, '_blank')
  }
}

/**
 * 打开指定地图应用
 */
export function openMapApp(type: 'apple' | 'google' | 'amap' | 'baidu' | 'tencent') {
  const { latitude, longitude, gpsLatitude, gpsLongitude, name, address } = venueInfo
  
  switch (type) {
    case 'apple':
      window.open(`https://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`, '_blank')
      break
      
    case 'google':
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${gpsLatitude},${gpsLongitude}`, '_blank')
      break
      
    case 'amap':
      // 高德地图
      if (isMobile()) {
        window.open(`androidamap://navi?sourceApplication=wedding&lat=${latitude}&lon=${longitude}&dev=0&style=2`, '_blank')
      } else {
        window.open(`https://uri.amap.com/navigation?to=${longitude},${latitude}&toName=${encodeURIComponent(name)}`, '_blank')
      }
      break
      
    case 'baidu':
      // 百度地图
      if (isMobile()) {
        window.open(`baidumap://map/direction?destination=${latitude},${longitude}&mode=driving&src=wedding`, '_blank')
      } else {
        window.open(`https://api.map.baidu.com/direction?destination=${latitude},${longitude}&mode=driving&region=洛阳`, '_blank')
      }
      break
      
    case 'tencent':
      // 腾讯地图
      if (isMobile()) {
        window.open(`qqmap://map/routeplan?type=drive&to=${name}&tocoord=${latitude},${longitude}`, '_blank')
      } else {
        window.open(`https://apis.map.qq.com/uri/v1/routeplan?type=drive&to=${name}&tocoord=${latitude},${longitude}`, '_blank')
      }
      break
  }
}

/**
 * 拨打电话（优化版）
 */
export function makeCall(phone: string) {
  const device = detectDevice()
  
  if (device === 'desktop') {
    // 桌面端：复制电话号码并提示
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone).then(() => {
        alert(`电话号码 ${phone} 已复制到剪贴板！\n\n请在手机上拨打此号码。`)
      })
    } else {
      // 降级方案：显示提示
      const confirmed = confirm(`电话号码：${phone}\n\n请使用手机拨打此号码。\n\n是否复制到剪贴板？`)
      if (confirmed) {
        // 创建临时输入框复制
        const input = document.createElement('input')
        input.value = phone
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        alert('已复制到剪贴板！')
      }
    }
  } else {
    // 移动端：直接拨打
    window.location.href = `tel:${phone}`
  }
}

/**
 * 复制电话号码
 */
export async function copyPhone(phone: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(phone)
      return true
    } else {
      // 降级方案
      const input = document.createElement('input')
      input.value = phone
      document.body.appendChild(input)
      input.select()
      const success = document.execCommand('copy')
      document.body.removeChild(input)
      return success
    }
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}

/**
 * 复制地址
 */
export async function copyAddress(): Promise<boolean> {
  try {
    const address = `${venueInfo.name}\n${venueInfo.address}`
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(address)
      return true
    } else {
      const input = document.createElement('input')
      input.value = address
      document.body.appendChild(input)
      input.select()
      const success = document.execCommand('copy')
      document.body.removeChild(input)
      return success
    }
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}

