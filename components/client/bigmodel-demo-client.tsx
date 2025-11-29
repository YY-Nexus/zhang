'use client'

import React, { useState } from 'react'

export default function BigModelDemoClient() {
  const [input, setInput] = useState('你好')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/bigmodel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      })

      const data = await res.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (err: any) {
      setResult(String(err.message || err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-md bg-card">
      <h4 className="font-medium mb-2">AI Demo（BigModel）</h4>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <button type="submit" className="px-3 py-2 bg-gold rounded" disabled={loading}>
          {loading ? '请求中...' : '发送'}
        </button>
        <button
          type="button"
          className="px-3 py-2 bg-muted rounded"
          onClick={() => window.dispatchEvent(new CustomEvent('open-floating-ai'))}
        >
          打开 AI 面板
        </button>
      </form>

      {result && <pre className="mt-3 p-3 bg-muted rounded text-xs overflow-auto">{result}</pre>}
    </div>
  )
}
