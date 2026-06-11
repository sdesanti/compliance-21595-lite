import { useState } from 'react'

const s = {
  wrap: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg)', padding: 24,
  },
  box: {
    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12,
    padding: 40, maxWidth: 460, width: '100%', display: 'flex', flexDirection: 'column', gap: 24,
  },
  title: { fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--text)', lineHeight: 1.3 },
  desc: { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 },
  label: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', letterSpacing: 2, marginBottom: 8 },
  input: {
    background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)',
    fontFamily: 'var(--font-mono)', fontSize: 13, padding: '12px 14px', borderRadius: 6,
    width: '100%', outline: 'none',
  },
  btn: {
    background: 'var(--blue)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 600,
    fontSize: 14, padding: '12px 20px', border: 'none', borderRadius: 6, cursor: 'pointer', width: '100%',
  },
  note: { fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 },
}

export default function ApiKeyGate({ onKey }) {
  const [key, setKey] = useState(sessionStorage.getItem('groq_key') || '')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const k = key.trim()
    if (!k) { setError('Ingresa tu API key de Google AI Studio'); return }
    setError('')
    sessionStorage.setItem('groq_key', k)
    onKey(k)
  }

  return (
    <div style={s.wrap}>
      <div style={s.box}>
        <div>
          <div style={s.title}>Compliance 21595<br />Analizador de Memorias</div>
        </div>
        <div style={s.desc}>
          Esta herramienta analiza memorias anuales de empresas chilenas bajo el marco de la
          Ley 21.595 de Delitos Económicos. Usa Groq + Llama 3.3 — consigue tu API key gratuita en{' '}
          <strong>console.groq.com</strong>.
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={s.label}>GROQ API KEY</div>
            <input
              style={s.input}
              type="password"
              placeholder="gsk_..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              autoComplete="off"
            />
          </div>
          <button style={s.btn} type="submit">CONTINUAR</button>
          {error && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--alert)' }}>{error}</div>}
        </form>
        <div style={s.note}>
          La API key se guarda solo en la sesión del navegador (sessionStorage) y nunca sale de tu computador.
          Las llamadas van directo a api.groq.com desde tu browser.
        </div>
      </div>
    </div>
  )
}
