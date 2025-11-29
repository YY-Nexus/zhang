#!/bin/bash
# 服务器端部署脚本
# 在服务器上执行此脚本

set -e

echo "🎊 开始服务器端部署..."

# 安装环境
echo "📦 安装Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs
fi

echo "📦 安装pnpm..."
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
fi

echo "📦 安装PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

echo "📦 安装Nginx..."
if ! command -v nginx &> /dev/null; then
    yum install -y nginx
fi

echo "📦 安装Certbot..."
if ! command -v certbot &> /dev/null; then
    yum install -y certbot python3-certbot-nginx
fi

# 构建项目
echo "🔨 构建项目..."
cd /opt/wedding-site
pnpm install --frozen-lockfile
pnpm build

# 配置PM2
echo "⚙️ 配置PM2..."
pm2 stop wedding-site 2>/dev/null || true
pm2 delete wedding-site 2>/dev/null || true
pm2 start npm --name "wedding-site" -- start
pm2 save
pm2 startup

# 配置Nginx
echo "🌐 配置Nginx..."
cat > /etc/nginx/conf.d/wedding-site.conf << 'NGINXCONF'
server {
    listen 80;
    server_name zhang.0379.love;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name zhang.0379.love;

    ssl_certificate /etc/letsencrypt/live/zhang.0379.love/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zhang.0379.love/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

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

    location / {
        proxy_pass http://127.0.0.1:3666;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXCONF

nginx -t
systemctl enable nginx
systemctl restart nginx

# 配置SSL证书
echo "🔒 配置SSL证书..."
certbot --nginx -d zhang.0379.love --non-interactive --agree-tos \
    --email admin@0379.email --redirect || echo "SSL证书配置失败，请手动配置"

# 配置防火墙
echo "🔥 配置防火墙..."
if command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --reload
fi

echo ""
echo "✅ 部署完成！"
echo "🌐 访问：https://zhang.0379.love"

