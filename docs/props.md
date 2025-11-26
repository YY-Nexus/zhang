Thought for 3s已读取弹窗组件弹窗组件已经具备完整功能。我现在生成完整的文档规范和使用示例：

已添加弹窗组件文档v8---

## Props 表格（Markdown）

| Prop | 类型 | 默认值 | 必填 | 说明
|-----|-----|-----|-----|-----
| `isOpen` | `boolean` | - | **是** | 控制弹窗显示状态
| `onClose` | `() => void` | - | **是** | 关闭回调，点击背景/Esc/关闭按钮时触发
| `title` | `string` | - | **是** | 弹窗标题
| `children` | `ReactNode` | - | **是** | 弹窗内容
| `icon` | `ReactNode` | - | 否 | 标题左侧图标
| `initialPosition` | `{ x: number; y: number }` | `{ x: 0, y: 0 }` | 否 | 初始位置偏移
| `width` | `string` | `"max-w-md"` | 否 | 弹窗宽度 (Tailwind class)
| `maxHeight` | `string` | `"max-h-[80vh]"` | 否 | 最大高度 (Tailwind class)
| `draggable` | `boolean` | `true` | 否 | 是否允许拖拽移动
| `minimizable` | `boolean` | `true` | 否 | 是否显示最小化按钮
| `maximizable` | `boolean` | `true` | 否 | 是否显示最大化按钮
| `ariaLabel` | `string` | - | 否 | ARIA 标签
| `ariaDescribedBy` | `string` | - | 否 | ARIA 描述 ID
| `onMinimize` | `(isMinimized: boolean) => void` | - | 否 | 最小化回调
| `onMaximize` | `(isMaximized: boolean) => void` | - | 否 | 最大化回调
| `onDragStart` | `() => void` | - | 否 | 拖拽开始回调
| `onDragEnd` | `(position: { x, y }) => void` | - | 否 | 拖拽结束回调
| `disableBackdropClose` | `boolean` | `false` | 否 | 禁用背景点击关闭
| `disableEscClose` | `boolean` | `false` | 否 | 禁用 Esc 键关闭
| `zIndex` | `number` | `50` | 否 | 自定义 z-index
| `reducedMotion` | `boolean` | `false` | 否 | 降级模式，禁用模糊动画


---

## 事件处理说明

### `onClose`事件

触发条件：

1. 点击关闭按钮（X）
2. 按下 Esc 键（除非 `disableEscClose: true`）
3. 点击背景遮罩（除非 `disableBackdropClose: true`）


```typescriptreact
const handleClose = () => {
  // 可在此保存状态、清理数据等
  setIsOpen(false)
}
```

### `draggable`及拖拽事件

当 `draggable: true` 时启用拖拽功能，配合 `onDragStart` 和 `onDragEnd` 追踪拖拽状态：

```typescriptreact
<DraggableModal
  draggable={true}
  onDragStart={() => console.log("拖拽开始")}
  onDragEnd={(pos) => console.log("结束位置:", pos)}
/>
```

弹窗组件已具备完整的微透背景、拖拽手柄、边界约束、最小化/最大化、Esc关闭、焦点陷阱等功能。动画采用 Framer Motion 实现 scale + blur + 阶段性阴影效果，并提供 `reducedMotion` 降级策略。

No issues found
