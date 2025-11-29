#!/bin/bash
# 快速部署脚本 - 简化版

SERVER_IP="47.94.135.202"
SERVER_USER="root"
DOMAIN="zhang.0379.love"

echo "🎊 婚礼网站快速部署"
echo ""
echo "服务器：$SERVER_IP"
echo "域名：$DOMAIN"
echo ""

# 检查是否可以直接SSH
echo "📤 准备上传文件..."
echo "请手动执行以下步骤："
echo ""
echo "1. 上传项目文件到服务器："
echo "   rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \\"
echo "       ./ root@$SERVER_IP:/opt/wedding-site/"
echo ""
echo "2. 连接服务器并执行部署："
echo "   ssh root@$SERVER_IP"
echo ""
echo "3. 在服务器上执行："
echo "   cd /opt/wedding-site"
echo "   bash <(curl -s https://raw.githubusercontent.com/YY-Nexus/zhang/main/scripts/server-setup.sh)"
echo ""
echo "或者查看完整部署说明："
echo "   cat docs/ECS部署说明.md"

