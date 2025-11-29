这是一个最小静态占位，用于临时部署到 Vercel。可以替换为一个简单登录页面或其它静态资源。
部署命令示例（在仓库根目录）：

# 从 .env.local 中读取 VERCEL_TOKEN 并部署
VERCEL_TOKEN=$(sed -n "s/^VERCEL_TOKEN=//p" .env.local | tr -d '"\'\'')
export VERCEL_TOKEN
npx vercel --cwd temp_vercel_deploy --token "$VERCEL_TOKEN" --confirm --prod

注意：该操作需要可用的网络连接和有效的 Vercel token。
