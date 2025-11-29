# 🔒 SSL 证书修复指南

**问题：** 浏览器显示 `NET::ERR_CERT_AUTHORITY_INVALID` 错误

**原因：** SSL 证书配置不正确或证书已过期

---

## 🚀 快速修复（推荐）

### 方法一：使用修复脚本（最简单）

在服务器上执行：

```bash
# 1. 上传修复脚本到服务器
# （脚本已包含在项目中：scripts/fix-ssl.sh）

# 2. 连接服务器
ssh root@47.94.135.202
# 密码：My151001

# 3. 进入项目目录
cd /opt/wedding-site

# 4. 执行修复脚本
chmod +x scripts/fix-ssl.sh
bash scripts/fix-ssl.sh
```

脚本会自动：

- ✅ 安装 Certbot（如果未安装）
- ✅ 清理旧证书
- ✅ 获取新证书
- ✅ 配置 Nginx
- ✅ 设置自动续期

---

## 🔧 手动修复步骤

### 步骤 1：连接服务器

```bash
ssh root@47.94.135.202
# 密码：My151001
```

### 步骤 2：安装 Certbot

```bash
# 安装Certbot
yum install -y certbot python3-certbot-nginx
```

### 步骤 3：停止 Nginx

```bash
systemctl stop nginx
```

### 步骤 4：清理旧证书

```bash
# 删除旧证书
rm -rf /etc/letsencrypt/live/zhang.0379.love
rm -rf /etc/letsencrypt/archive/zhang.0379.love
rm -rf /etc/letsencrypt/renewal/zhang.0379.love.conf
```

### 步骤 5：临时配置 Nginx（用于验证）

```bash
# 创建验证目录
mkdir -p /var/www/html/.well-known/acme-challenge

# 临时Nginx配置
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

# 启动Nginx
systemctl start nginx
```

### 步骤 6：获取 SSL 证书

```bash
certbot certonly \
    --webroot \
    --webroot-path=/var/www/html \
    --email admin@0379.email \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d zhang.0379.love
```

### 步骤 7：配置完整 Nginx

```bash
cat > /etc/nginx/conf.d/wedding-site.conf << 'EOF'
# HTTP重定向到HTTPS
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

# HTTPS配置
server {
    listen 443 ssl http2;
    server_name zhang.0379.love;

    # SSL证书
    ssl_certificate /etc/letsencrypt/live/zhang.0379.love/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zhang.0379.love/privkey.pem;

    # SSL配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

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
    }
}
EOF
```

### 步骤 8：测试并重启 Nginx

```bash
# 测试配置
nginx -t

# 重启Nginx
systemctl restart nginx
```

### 步骤 9：设置自动续期

```bash
# 添加定时任务
(crontab -l 2>/dev/null; echo "0 0,12 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -
```

---

## ✅ 验证修复

### 1. 检查证书文件

```bash
ls -la /etc/letsencrypt/live/zhang.0379.love/
```

应该看到：

- `fullchain.pem` - 完整证书链
- `privkey.pem` - 私钥

### 2. 测试 HTTPS 访问

```bash
curl -I https://zhang.0379.love
```

应该返回 `200 OK`

### 3. 浏览器测试

访问：<https://zhang.0379.love>

应该看到：

- ✅ 地址栏显示 🔒 锁图标
- ✅ 没有证书错误提示
- ✅ 网站正常加载

---

## 🔍 常见问题排查

### 问题 1：DNS 解析失败

```bash
# 检查DNS解析
nslookup zhang.0379.love

# 应该返回：47.94.135.202
```

如果解析不正确，检查 DNS 配置。

### 问题 2：防火墙未开放 443 端口

```bash
# 检查防火墙
firewall-cmd --list-ports

# 如果没有443，添加：
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

### 问题 3：证书获取失败

可能原因：

- DNS 未正确解析
- 80 端口未开放
- 域名验证失败

解决：

```bash
# 检查80端口是否开放
netstat -tlnp | grep :80

# 检查Nginx是否运行
systemctl status nginx

# 查看Certbot日志
tail -f /var/log/letsencrypt/letsencrypt.log
```

### 问题 4：HSTS 错误

如果浏览器显示 HSTS 错误，需要清除 HSTS：

**Chrome/Edge：**

1. 访问：`chrome://net-internals/#hsts`
2. 在"Delete domain security policies"中输入：`zhang.0379.love`
3. 点击"Delete"

**Firefox：**

1. 访问：`about:preferences#privacy`
2. 清除浏览数据 → 选择"Cookie 和网站数据"

---

## 📋 修复后检查清单

- [ ] SSL 证书文件存在
- [ ] Nginx 配置正确
- [ ] 防火墙开放 443 端口
- [ ] DNS 解析正确
- [ ] 浏览器可以正常访问 HTTPS
- [ ] 证书自动续期已设置

---

## 🎉 修复完成

修复完成后，网站应该可以正常通过 HTTPS 访问：

- **<https://zhang.0379.love>**

证书有效期：90 天（Let's Encrypt 自动续期）

---

**如果仍有问题，请检查服务器日志：**

```bash
# Nginx错误日志
tail -f /var/log/nginx/error.log

# Certbot日志
tail -f /var/log/letsencrypt/letsencrypt.log
```
