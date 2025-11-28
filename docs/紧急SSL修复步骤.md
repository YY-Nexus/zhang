# 🚨 紧急SSL证书修复（3步完成）

**问题：** 浏览器显示证书错误 `NET::ERR_CERT_AUTHORITY_INVALID`

---

## ⚡ 快速修复（复制执行）

### 步骤1：连接服务器

```bash
ssh root@47.94.135.202
# 密码：My151001
```

### 步骤2：执行修复脚本

```bash
cd /opt/wedding-site
chmod +x scripts/fix-ssl.sh
bash scripts/fix-ssl.sh
```

### 步骤3：验证

访问：https://zhang.0379.love

应该看到 🔒 锁图标，没有错误提示。

---

## 🔧 如果脚本失败，手动执行：

```bash
# 1. 安装Certbot
yum install -y certbot python3-certbot-nginx

# 2. 停止Nginx
systemctl stop nginx

# 3. 清理旧证书
rm -rf /etc/letsencrypt/live/zhang.0379.love

# 4. 创建验证目录
mkdir -p /var/www/html/.well-known/acme-challenge

# 5. 临时Nginx配置（仅HTTP）
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

# 6. 启动Nginx
systemctl start nginx

# 7. 获取证书
certbot certonly --webroot --webroot-path=/var/www/html \
    --email admin@0379.email --agree-tos --no-eff-email \
    --force-renewal -d zhang.0379.love

# 8. 使用server-setup.sh重新配置Nginx（会自动使用新证书）
bash scripts/server-setup.sh
```

---

## ✅ 修复后验证

```bash
# 检查证书
ls -la /etc/letsencrypt/live/zhang.0379.love/

# 测试HTTPS
curl -I https://zhang.0379.love

# 检查Nginx
systemctl status nginx
```

---

**修复完成后，清除浏览器HSTS缓存：**

Chrome/Edge: `chrome://net-internals/#hsts` → 删除 `zhang.0379.love`

Firefox: 清除Cookie和网站数据

---

**现在就可以开始修复了！** 🔒

