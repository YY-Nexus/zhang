#!/bin/bash
# SSL证书修复脚本
# 用于修复 zhang.0379.love 的SSL证书问题

set -e

echo "🔒 开始修复SSL证书..."

DOMAIN="zhang.0379.love"
EMAIL="admin@0379.email"

# 1. 检查Certbot是否安装
if ! command -v certbot &> /dev/null; then
    echo "📦 安装Certbot..."
    yum install -y certbot python3-certbot-nginx
fi

# 2. 停止Nginx（临时）
echo "⏸️  临时停止Nginx..."
systemctl stop nginx

# 3. 删除旧的证书（如果存在）
echo "🗑️  清理旧证书..."
rm -rf /etc/letsencrypt/live/${DOMAIN}
rm -rf /etc/letsencrypt/archive/${DOMAIN}
rm -rf /etc/letsencrypt/renewal/${DOMAIN}.conf

# 4. 临时配置Nginx（仅HTTP，用于验证）
echo "⚙️  配置临时Nginx..."
cat > /etc/nginx/conf.d/wedding-site-temp.conf << 'EOF'
server {
    listen 80;
    server_name zhang.0379.love;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}
EOF

# 创建验证目录
mkdir -p /var/www/html/.well-known/acme-challenge

# 启动Nginx
systemctl start nginx

# 5. 获取新证书
echo "📜 获取SSL证书..."
certbot certonly \
    --webroot \
    --webroot-path=/var/www/html \
    --email ${EMAIL} \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d ${DOMAIN}

# 6. 配置完整的Nginx（HTTP + HTTPS）
echo "⚙️  配置完整Nginx..."
cat > /etc/nginx/conf.d/wedding-site.conf << 'NGINXCONF'
# HTTP重定向到HTTPS
server {
    listen 80;
    server_name zhang.0379.love;
    
    # Let's Encrypt验证
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # 其他请求重定向到HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS配置
server {
    listen 443 ssl http2;
    server_name zhang.0379.love;

    # SSL证书
    ssl_certificate /etc/letsencrypt/live/zhang.0379.love/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zhang.0379.love/privkey.pem;

    # SSL配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # 静态资源
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

    # 代理到Next.js应用
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
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
NGINXCONF

# 删除临时配置
rm -f /etc/nginx/conf.d/wedding-site-temp.conf

# 7. 测试Nginx配置
echo "🧪 测试Nginx配置..."
nginx -t

# 8. 重启Nginx
echo "🔄 重启Nginx..."
systemctl restart nginx

# 9. 设置自动续期
echo "⏰ 设置证书自动续期..."
(crontab -l 2>/dev/null; echo "0 0,12 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -

# 10. 验证证书
echo "✅ 验证SSL证书..."
sleep 2
curl -I https://${DOMAIN} || echo "⚠️  证书验证失败，请检查DNS和防火墙"

echo ""
echo "🎉 SSL证书修复完成！"
echo "🌐 访问：https://${DOMAIN}"
echo ""
echo "如果仍有问题，请检查："
echo "1. DNS解析是否正确：nslookup ${DOMAIN}"
echo "2. 防火墙是否开放443端口：firewall-cmd --list-ports"
echo "3. 证书文件是否存在：ls -la /etc/letsencrypt/live/${DOMAIN}/"

