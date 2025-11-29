#!/bin/bash
# 婚礼网站部署脚本

set -e

echo "🎊 开始部署婚礼网站..."

# 检查Node.js版本
if ! command -v node &> /dev/null; then
    echo "❌ 未找到Node.js，请先安装Node.js >= 18.0.0"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js版本过低，需要 >= 18.0.0"
    exit 1
fi

# 检查pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 安装pnpm..."
    npm install -g pnpm
fi

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 构建项目
echo "🔨 构建项目..."
pnpm build

# 检查构建结果
if [ ! -d ".next" ]; then
    echo "❌ 构建失败，.next目录不存在"
    exit 1
fi

echo "✅ 构建完成！"
echo ""
echo "🚀 启动生产服务器："
echo "   pnpm start"
echo ""
echo "📝 或使用PM2管理："
echo "   pm2 start npm --name 'wedding-site' -- start"
echo "   pm2 save"
echo ""

