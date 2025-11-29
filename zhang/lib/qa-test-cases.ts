/**
 * 提示词 I：QA 测试用例
 * 包含弹窗、音乐播放器、3D画廊、浮动AI、RSVP、实时聊天等模块
 * 共20条测试用例
 */

export interface TestCase {
  id: number
  title: string
  precondition: string
  steps: string[]
  expected: string
  module: string
}

export const testCases: TestCase[] = [
  // 弹窗模块测试 (1-5)
  {
    id: 1,
    title: "弹窗拖拽边界约束",
    precondition: "打开任意弹窗（如音乐播放器）",
    steps: ["按住弹窗顶部拖拽手柄", "向屏幕边缘拖拽", "尝试将弹窗拖出视口范围"],
    expected: "弹窗应被约束在视口内，无法完全拖出屏幕边界",
    module: "弹窗",
  },
  {
    id: 2,
    title: "弹窗ESC键关闭",
    precondition: "任意弹窗处于打开状态",
    steps: ["确保弹窗获得焦点", "按下键盘ESC键"],
    expected: "弹窗应平滑关闭，背景模糊效果消失，焦点返回触发元素",
    module: "弹窗",
  },
  {
    id: 3,
    title: "弹窗背景点击关闭",
    precondition: "弹窗打开且disableBackdropClose未设置",
    steps: ["点击弹窗外部的模糊背景区域"],
    expected: "弹窗关闭，触发onClose回调，动画时长350ms",
    module: "弹窗",
  },
  {
    id: 4,
    title: "弹窗最小化与恢复",
    precondition: "弹窗打开且minimizable=true",
    steps: ["点击最小化按钮", "观察弹窗状态", "点击任务栏或再次点击恢复"],
    expected: "弹窗缩小至底部任务栏位置，恢复后回到原位置和尺寸",
    module: "弹窗",
  },
  {
    id: 5,
    title: "弹窗焦点陷阱",
    precondition: "弹窗打开状态",
    steps: ["连续按Tab键循环焦点", "按Shift+Tab反向循环"],
    expected: "焦点应始终在弹窗内部元素间循环，不应逃逸到背景页面",
    module: "弹窗",
  },
  // 音乐播放器测试 (6-10)
  {
    id: 6,
    title: "音乐投票并发处理",
    precondition: "音乐播放器打开，显示曲目列表",
    steps: ["同时从多个设备对同一曲目点击投票", "观察投票计数变化"],
    expected: "投票数正确累加，无重复计数，UI实时更新且无闪烁",
    module: "音乐播放器",
  },
  {
    id: 7,
    title: "音乐分段切换",
    precondition: "音乐播放器打开",
    steps: ["切换到'进场'分段", "切换到'敬茶'分段", "切换到'用餐'分段", "切换到'送客'分段"],
    expected: "每次切换正确加载对应曲目列表，当前播放状态正确保持或重置",
    module: "音乐播放器",
  },
  {
    id: 8,
    title: "音乐淡入淡出过渡",
    precondition: "正在播放音乐",
    steps: ["点击下一曲或切换曲目"],
    expected: "当前曲目500ms淡出，新曲目500ms淡入，过渡平滑无爆音",
    module: "音乐播放器",
  },
  {
    id: 9,
    title: "音量记忆持久化",
    precondition: "音乐播放器打开",
    steps: ["调整音量至50%", "关闭弹窗", "刷新页面", "重新打开音乐播放器"],
    expected: "音量应恢复到50%，状态从localStorage正确读取",
    module: "音乐播放器",
  },
  {
    id: 10,
    title: "跨设备播放位置同步",
    precondition: "在设备A播放音乐",
    steps: ["在设备B打开同一会话", "调用syncPosition(sessionId)"],
    expected: "设备B应同步到设备A的播放位置，误差不超过2秒",
    module: "音乐播放器",
  },
  // 3D画廊测试 (11-14)
  {
    id: 11,
    title: "3D画廊照片点击弹窗",
    precondition: "3D画廊加载完成（桌面端）",
    steps: ["点击任意画框照片"],
    expected: "弹出照片详情弹窗，显示大图、标题、描述，触发对应音乐播放",
    module: "3D画廊",
  },
  {
    id: 12,
    title: "3D画廊悬浮高亮",
    precondition: "3D画廊正常显示",
    steps: ["将鼠标悬停在画框上", "移开鼠标"],
    expected: "画框放大1.08倍并显示金色点光源，移开后恢复原状",
    module: "3D画廊",
  },
  {
    id: 13,
    title: "移动端画廊降级",
    precondition: "在移动设备或窄屏幕(<768px)访问",
    steps: ["观察画廊显示形式", "左右滑动切换照片"],
    expected: "显示平面滑动视图而非3D画廊，支持触控滑动与惯性滚动",
    module: "3D画廊",
  },
  {
    id: 14,
    title: "3D画廊纹理加载失败降级",
    precondition: "网络不稳定或图片路径错误",
    steps: ["断开网络", "刷新页面观察画廊"],
    expected: "显示灰色占位而非报错，页面其他功能正常可用",
    module: "3D画廊",
  },
  // 浮动AI测试 (15-17)
  {
    id: 15,
    title: "浮动AI按钮脉冲动画",
    precondition: "页面加载完成",
    steps: ["观察左上角AI按钮"],
    expected: "按钮周围显示2秒周期的金色脉冲光环动画",
    module: "浮动AI",
  },
  {
    id: 16,
    title: "AI面板快捷操作",
    precondition: "打开AI面板",
    steps: ["点击'导航到会场'快捷按钮"],
    expected: "触发navigate_to_venue命令，打开地图导航或显示地址信息",
    module: "浮动AI",
  },
  {
    id: 17,
    title: "AI面板拖拽移动",
    precondition: "AI面板打开",
    steps: ["拖拽面板到屏幕右下角", "松开鼠标"],
    expected: "面板移动到新位置并停留，不超出视口边界",
    module: "浮动AI",
  },
  // RSVP测试 (18-19)
  {
    id: 18,
    title: "RSVP表单提交验证",
    precondition: "打开RSVP弹窗",
    steps: ["不填写姓名直接点击提交", "填写完整信息后提交"],
    expected: "空姓名时显示验证错误，完整填写后成功提交并显示确认",
    module: "RSVP",
  },
  {
    id: 19,
    title: "RSVP餐饮偏好选择",
    precondition: "RSVP弹窗打开",
    steps: ["选择餐饮偏好（素食/清真/无特殊要求）", "填写过敏信息", "提交表单"],
    expected: "偏好信息正确保存，后端记录完整的餐饮需求",
    module: "RSVP",
  },
  // 实时聊天测试 (20)
  {
    id: 20,
    title: "留言墙实时更新",
    precondition: "留言墙弹窗打开",
    steps: ["在设备A发送一条祝福留言", "在设备B观察留言墙"],
    expected: "设备B应在3秒内看到新留言出现，无需手动刷新",
    module: "实时聊天",
  },
]

// Markdown表格格式输出（供验收使用）
export const testCasesMarkdown = `
## QA 测试用例表格

| 序号 | 用例标题 | 模块 | 前置条件 | 操作步骤 | 预期结果 |
|------|----------|------|----------|----------|----------|
| 1 | 弹窗拖拽边界约束 | 弹窗 | 打开任意弹窗 | 1.按住拖拽手柄 2.向边缘拖拽 3.尝试拖出视口 | 弹窗被约束在视口内 |
| 2 | 弹窗ESC键关闭 | 弹窗 | 弹窗打开状态 | 1.确保焦点在弹窗 2.按ESC键 | 弹窗平滑关闭 |
| 3 | 弹窗背景点击关闭 | 弹窗 | 弹窗打开 | 1.点击模糊背景区域 | 弹窗关闭，动画350ms |
| 4 | 弹窗最小化与恢复 | 弹窗 | minimizable=true | 1.点击最小化 2.点击恢复 | 缩小至任务栏后可恢复 |
| 5 | 弹窗焦点陷阱 | 弹窗 | 弹窗打开 | 1.按Tab循环 2.按Shift+Tab | 焦点在弹窗内循环 |
| 6 | 音乐投票并发处理 | 音乐播放器 | 播放器打开 | 1.多设备同时投票同一曲目 | 投票数正确累加无重复 |
| 7 | 音乐分段切换 | 音乐播放器 | 播放器打开 | 1.切换进场/敬茶/用餐/送客 | 正确加载对应曲目列表 |
| 8 | 音乐淡入淡出过渡 | 音乐播放器 | 正在播放 | 1.切换曲目 | 500ms淡出+500ms淡入 |
| 9 | 音量记忆持久化 | 音乐播放器 | 播放器打开 | 1.调音量50% 2.刷新 3.重开 | 音量恢复到50% |
| 10 | 跨设备播放位置同步 | 音乐播放器 | 设备A播放中 | 1.设备B调用syncPosition | 同步位置误差不超2秒 |
| 11 | 3D画廊照片点击弹窗 | 3D画廊 | 画廊加载完成 | 1.点击画框照片 | 弹出详情+触发音乐 |
| 12 | 3D画廊悬浮高亮 | 3D画廊 | 画廊正常显示 | 1.悬停画框 2.移开鼠标 | 放大1.08倍+金色光源 |
| 13 | 移动端画廊降级 | 3D画廊 | 移动设备访问 | 1.观察 2.滑动切换 | 平面滑动视图+触控支持 |
| 14 | 3D画廊纹理加载失败 | 3D画廊 | 网络不稳定 | 1.断网 2.刷新 | 显示灰色占位无报错 |
| 15 | 浮动AI按钮脉冲动画 | 浮动AI | 页面加载完成 | 1.观察AI按钮 | 2秒周期金色脉冲光环 |
| 16 | AI面板快捷操作 | 浮动AI | AI面板打开 | 1.点击'导航到会场' | 触发导航命令 |
| 17 | AI面板拖拽移动 | 浮动AI | AI面板打开 | 1.拖拽到右下角 2.松开 | 面板停留新位置 |
| 18 | RSVP表单提交验证 | RSVP | RSVP弹窗打开 | 1.空姓名提交 2.完整提交 | 显示验证/成功确认 |
| 19 | RSVP餐饮偏好选择 | RSVP | RSVP弹窗打开 | 1.选偏好 2.填过敏 3.提交 | 餐饮需求正确保存 |
| 20 | 留言墙实时更新 | 实时聊天 | 留言墙打开 | 1.A发留言 2.B观察 | 3秒内看到新留言 |
`

// 按模块分组获取测试用例
export function getTestCasesByModule(module: string): TestCase[] {
  return testCases.filter((tc) => tc.module === module)
}

// 获取所有模块列表
export function getAllModules(): string[] {
  return [...new Set(testCases.map((tc) => tc.module))]
}
