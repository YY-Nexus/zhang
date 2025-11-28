export const revalidate = 0
export const dynamic = 'force-dynamic'

export default function GlobalErrorPage() {
  return (
    <main
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>发生错误</h1>
        <p style={{ color: '#666' }}>抱歉，页面暂时不可用。请稍后再试或联系站点管理员。</p>
      </div>
    </main>
  )
}
