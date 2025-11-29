import { NextResponse } from 'next/server'

const BIGMODEL_URL = process.env.BIGMODEL_API_URL || 'https://open.bigmodel.cn/api/paas/v4'
const API_KEY = process.env.BIGMODEL_API_KEY

export async function POST(req: Request) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'BIGMODEL_API_KEY not configured' }, { status: 500 })
  }

  try {
    const body = await req.json()

    const res = await fetch(BIGMODEL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    const text = await res.text()
    const contentType = res.headers.get('content-type') || 'application/json'

    return new Response(text, {
      status: res.status,
      headers: { 'Content-Type': contentType },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
