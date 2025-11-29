#!/bin/bash

# 修复音乐文件路径脚本
# 将 /music/ 替换为 /MP4/

echo "🎵 修复婚礼音乐文件路径..."

# 查找所有音乐文件路径并替换
sed -i '' 's|/music/|/MP4/|g' lib/music-playlist.ts

echo "✅ 音乐文件路径修复完成"
echo ""
echo "🎼 音乐文件目录结构："
echo "/public/MP4/dining/     # 用餐曲目"
echo "/public/MP4/entrance/   # 进场曲目"
echo "/public/MP4/farewell/   # 送客曲目"
echo "/public/MP4/tea/        # 敬茶曲目"
echo ""
echo "📝 文件路径已更新为："
echo "  /MP4/dining/邓丽君 - 月亮代表我的心.mp3"
echo "  /MP4/entrance/沫言 - 给你们.mp3"
echo "  /MP4/farewell/李谷一 - 难忘今宵.mp3"
echo "  /MP4/tea/筷子兄弟 - 父亲.mp3"