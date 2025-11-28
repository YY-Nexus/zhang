# 🚀 阿里云ECS部署说明

**服务器信息：**
- **IP地址**：47.94.135.202
- **内网IP**：172.22.238.241
- **域名**：zhang.0379.love（已解析）
- **操作系统**：Alibaba Cloud Linux 3.2104 LTS 64位
- **配置**：2vCPU / 2GiB RAM / 3Mbps

---

## 📋 部署步骤

### 方式一：自动部署脚本（推荐）

1. **安装必要工具**
   ```bash
   # macOS
   brew install sshpass
   
   # Linux
   sudo apt-get install sshpass
   ```

2. **执行部署脚本**
   ```bash
   chmod +x deploy-to-ecs.sh
   ./deploy-to-ecs.sh
   ```

脚本会自动完成：
- ✅ 安装Node.js、pnpm、PM2、Nginx
- ✅ 上传项目文件
- ✅ 构建项目
- ✅ 配置PM2进程管理
- ✅ 配置Nginx反向代理
- ✅ 配置SSL证书（Let's Encrypt）
- ✅ 配置防火墙

---

### 方式二：手动部署

#### 1. 连接服务器
```bash
ssh root@47.94.135.202
# 密码：My151001
```

#### 2. 安装环境
```bash
# 更新系统
yum update -y

# 安装Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# 安装pnpm
npm install -g pnpm

# 安装PM2
npm install -g pm2

# 安装Nginx
yum install -y nginx

# 安装Certbot（SSL证书）
yum install -y certbot python3-certbot-nginx
```

#### 3. 上传项目
```bash
# 在本地执行
cd /Users/yanyu/Documents/zhang
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
    ./ root@47.94.135.202:/opt/wedding-site/
```

#### 4. 构建项目
```bash
# 在服务器上执行
cd /opt/wedding-site
pnpm install --frozen-lockfile
pnpm build
```

#### 5. 启动应用
```bash
# 使用PM2管理
pm2 start npm --name "wedding-site" -- start -- --port 3666
pm2 save
pm2 startup
```

#### 6. 配置Nginx
```bash
# 创建Nginx配置
cat > /etc/nginx/conf.d/wedding-site.conf << 'EOF'
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

    location / {
        proxy_pass http://127.0.0.1:3666;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 测试配置
nginx -t

# 启动Nginx
systemctl enable nginx
systemctl start nginx
```

#### 7. 配置SSL证书
```bash
certbot --nginx -d zhang.0379.love --non-interactive --agree-tos \
    --email admin@0379.email --redirect

# 设置自动续期
systemctl enable certbot.timer
systemctl start certbot.timer
```

#### 8. 配置防火墙
```bash
# 开放端口
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

---

## 🔧 常用命令

### 查看服务状态
```bash
# PM2状态
pm2 status
pm2 logs wedding-site

# Nginx状态
systemctl status nginx

# 查看端口
netstat -tlnp | grep 3666
```

### 重启服务
```bash
# 重启应用
pm2 restart wedding-site

# 重启Nginx
systemctl restart nginx
```

### 更新部署
```bash
# 1. 上传新代码
rsync -avz --exclude 'node_modules' --exclude '.next' \
    ./ root@47.94.135.202:/opt/wedding-site/

# 2. 在服务器上重新构建
ssh root@47.94.135.202
cd /opt/wedding-site
pnpm install
pnpm build
pm2 restart wedding-site
```

---

## 📊 部署后验证

部署完成后，请检查：
- [ ] 网站可以访问：https://zhang.0379.love
- [ ] SSL证书正常（浏览器显示🔒）
- [ ] 所有照片正常显示
- [ ] 所有视频正常播放
- [ ] 音乐自动播放正常
- [ ] 移动端响应式正常

---

## ⚠️ 注意事项

1. **安全组配置**
   - 确保阿里云安全组开放端口：22（SSH）、80（HTTP）、443（HTTPS）

2. **域名解析**
   - 已确认：zhang.0379.love → 47.94.135.202 ✅

3. **SSL证书**
   - 使用Let's Encrypt免费证书
   - 自动续期已配置

4. **进程管理**
   - 使用PM2管理，服务器重启后自动启动

---

## 🎊 部署完成

部署完成后，网站将在以下地址可用：
- **HTTP**：http://zhang.0379.love（自动跳转HTTPS）
- **HTTPS**：https://zhang.0379.love

**祝张波 & 邓芮新婚快乐！** 🎉

