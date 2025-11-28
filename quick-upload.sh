#!/bin/bash
# 快速上传脚本

echo "📤 开始上传项目文件到服务器..."
echo ""

cd /Users/yanyu/Documents/zhang

rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude '.DS_Store' \
    --exclude '*.log' \
    --exclude '.trae' \
    ./ root@47.94.135.202:/opt/wedding-site/

echo ""
echo "✅ 文件上传完成！"
echo ""
echo "下一步："
echo "1. ssh root@47.94.135.202"
echo "2. cd /opt/wedding-site"
echo "3. bash scripts/server-setup.sh"

