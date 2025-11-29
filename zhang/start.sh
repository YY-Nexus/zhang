#!/bin/bash

# 张波邓芮婚礼网站启动脚本
# YYC³ 自动部署系统

echo "🎉 张波邓芮婚礼网站启动脚本"
echo "=================================="

# 环境检查
echo "📍 当前目录: $(pwd)"
echo "🔧 检查Node.js和Node版本..."

# 尝试使用Node.js
if command -v node &> /dev/null; then
    NODE_CMD="node"
    echo "✅ 检测到Node.js: $(node --version)"
else
    echo "❌ 未找到Node.js，请先安装"
    exit 1
fi

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装项目依赖..."
    if command -v bun &> /dev/null; then
        bun install
    elif command -v npm &> /dev/null; then
        npm install
    else
        echo "❌ 请安装npm或bun"
        exit 1
    fi
fi

# 构建项目
echo "🔨 构建Next.js应用..."
$NODE_CMD ./node_modules/.bin/next build

# 启动应用
echo "🚀 启动婚礼网站..."
echo "🌐 网站将在 http://localhost:3000 启动"
echo "⏰ 请稍候..."

# 启动服务并保持运行
$NODE_CMD ./node_modules/.bin/next start