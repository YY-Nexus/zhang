#!/bin/bash
# 阿里云ECS部署脚本 - 婚礼网站
# 服务器信息：
# IP: 47.94.135.202
# 域名: zhang.0379.love
# 用户: root

set -e

echo "🎊 开始部署婚礼网站到阿里云ECS..."

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
    echo "❌ SSH连接失败，请检查："
    echo "   1. 服务器是否开启SSH（端口22）"
    echo "   2. 密码是否正确"
    echo "   3. 安全组是否允许SSH访问"
    exit 1
fi

echo "✅ SSH连接成功"
echo ""

# 在服务器上执行部署
echo "🚀 开始服务器端部署..."

sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
set -e

echo "📦 更新系统包..."
yum update -y

echo "📦 安装Node.js和pnpm..."
# 安装Node.js 18
if ! command -v node &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs
fi

# 安装pnpm
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
fi

# 安装PM2
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# 安装基础工具
yum install -y rsync

# 安装Nginx
if ! command -v nginx &> /dev/null; then
    yum install -y nginx
fi

# 安装Certbot（用于SSL证书）
if ! command -v certbot &> /dev/null; then
    yum install -y certbot python3-certbot-nginx
fi

echo "✅ 环境准备完成"
ENDSSH

echo ""
echo "📤 上传项目文件..."
# 使用rsync上传文件（排除node_modules等）
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude '.DS_Store' \
    --exclude '*.log' \
    -e "sshpass -p '$SERVER_PASS' ssh -o StrictHostKeyChecking=no" \
    ./ "$SERVER_USER@$SERVER_IP:/opt/wedding-site/"

echo ""
echo "🔨 在服务器上构建项目..."

sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << ENDSSH
set -e

cd /opt/wedding-site

echo "📦 安装依赖..."
pnpm install --frozen-lockfile

echo "🔨 构建项目..."
pnpm build

echo "✅ 构建完成"
ENDSSH

echo ""
echo "⚙️ 配置PM2..."

sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << ENDSSH
cd /opt/wedding-site

# 停止旧进程
pm2 stop wedding-site 2>/dev/null || true
pm2 delete wedding-site 2>/dev/null || true

# 启动新进程
pm2 start npm --name "wedding-site" -- start -- --port $APP_PORT
pm2 save
pm2 startup

echo "✅ PM2配置完成"
ENDSSH

echo ""
echo "🌐 配置Nginx..."

sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << ENDSSH
cat > /etc/nginx/conf.d/wedding-site.conf << 'NGINXCONF'
server {
    listen 80;
    server_name zhang.0379.love;

    # 重定向到HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name zhang.0379.love;

    # SSL证书（Certbot会自动配置）
    ssl_certificate /etc/letsencrypt/live/zhang.0379.love/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zhang.0379.love/privkey.pem;

    # SSL配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 日志
    access_log /var/log/nginx/wedding-site-access.log;
    error_log /var/log/nginx/wedding-site-error.log;

    # 静态文件
    location /_next/static {
        alias /opt/wedding-site/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /public {
        alias /opt/wedding-site/public;
        expires 30d;
        add_header Cache-Control "public";
    }

    # 代理到Next.js
    location / {
        proxy_pass http://127.0.0.1:3666;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINXCONF

# 测试Nginx配置
nginx -t

# 启动Nginx
systemctl enable nginx
systemctl restart nginx

echo "✅ Nginx配置完成"
ENDSSH

echo ""
echo "🔒 配置SSL证书..."

sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << ENDSSH
# 获取SSL证书
certbot --nginx -d zhang.0379.love --non-interactive --agree-tos --email admin@0379.email --redirect

# 设置自动续期
systemctl enable certbot.timer
systemctl start certbot.timer

echo "✅ SSL证书配置完成"
ENDSSH

echo ""
echo "🔥 配置防火墙..."

sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << ENDSSH
# 开放端口
if command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --reload
fi

echo "✅ 防火墙配置完成"
ENDSSH

echo ""
echo "✅ 部署完成！"
echo ""
echo "🌐 访问地址："
echo "   http://zhang.0379.love"
echo "   https://zhang.0379.love"
echo ""
echo "📊 查看服务状态："
echo "   ssh root@$SERVER_IP 'pm2 status'"
echo ""
echo "📝 查看日志："
echo "   ssh root@$SERVER_IP 'pm2 logs wedding-site'"
echo ""

