#!/bin/bash
# 简化版部署脚本 - 婚礼网站
set -e

echo "🎊 开始简化部署婚礼网站到阿里云ECS..."

# 服务器信息
SERVER_IP="47.94.135.202"
SERVER_USER="root"
SERVER_PASS="My151001"
DOMAIN="zhang.0379.love"
APP_PORT="3666"

echo "📋 服务器信息："
echo "   IP: $SERVER_IP"
echo "   域名: $DOMAIN"
echo "   端口: $APP_PORT"
echo ""

# 检查SSH连接
echo "🔌 检查SSH连接..."
if ! sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "echo 'SSH连接成功'" 2>/dev/null; then
    echo "❌ SSH连接失败"
    exit 1
fi

echo "✅ SSH连接成功"
echo ""

# 创建项目目录并上传核心文件
echo "📤 上传核心项目文件..."
sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "mkdir -p /opt/wedding-site"

# 只上传必要文件，排除大文件
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude '*.tar.gz' \
    --exclude '*.zip' \
    --exclude 'docs' \
    --exclude '.DS_Store' \
    --exclude '*.log' \
    -e "sshpass -p '$SERVER_PASS' ssh -o StrictHostKeyChecking=no" \
    ./ "$SERVER_USER@$SERVER_IP:/opt/wedding-site/"

echo ""
echo "🔨 在服务器上构建项目..."

sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << ENDSSH
cd /opt/wedding-site

echo "📦 安装依赖..."
npm install

echo "🔨 构建项目..."
npm run build

echo "✅ 构建完成"
ENDSSH

echo ""
echo "✅ 简化部署完成！"
echo "🌐 访问地址："
echo "   http://zhang.0379.love"
echo "   https://zhang.0379.love"
echo ""