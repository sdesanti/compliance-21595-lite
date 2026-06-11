import { useState } from 'react'
import ApiKeyGate from './components/ApiKeyGate.jsx'
import Dropzone from './components/Dropzone.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import InformePanel from './components/InformePanel.jsx'
import { useAnalysisLite } from './hooks/useAnalysisLite.js'

const s = {
  page: { minHeight: '100vh', background: 'var(--bg)', padding: '48px 24px' },
  inner: { maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 },
  header: { borderBottom: '1px solid var(--border)', paddingBottom: 24 },
  title: { fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--text)' },
  sub: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--blue)', letterSpacing: 2, marginBottom: 8 },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 },
  keyBtn: {
    background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)',
    fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 12px', borderRadius: 4, cursor: 'pointer',
  },
  errBox: {
    background: 'var(--bg2)', border: '1px solid var(--alert)', borderRadius: 8,
    padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--alert)',
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  retryBtn: {
    alignSelf: 'flex-start', background: 'transparent', border: '1px solid var(--alert)',
    color: 'var(--alert)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '8px 16px',
    borderRadius: 4, cursor: 'pointer',
  },
}

export default function App() {
  const [apiKey, setApiKey] = useState(sessionStorage.getItem('groq_key') || '')
  const { state, progress, progressMsg, resultado, error, fileName, analizar, reset } = useAnalysisLite()

  const changeKey = () => {
    sessionStorage.removeItem('groq_key')
    setApiKey('')
    reset()
  }

  if (!apiKey) return <ApiKeyGate onKey={setApiKey} />

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <div style={s.header}>
          <div style={s.sub}>HERRAMIENTA DE ANÁLISIS</div>
          <div style={s.topBar}>
            <div style={s.title}>Compliance 21.595</div>
            <button style={s.keyBtn} onClick={changeKey}>CAMBIAR API KEY</button>
          </div>
        </div>

        {state === 'idle' && <Dropzone onFile={(f) => analizar(f, apiKey)} />}

        {(state === 'extracting' || state === 'analyzing') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>{fileName}</div>
            <ProgressBar progress={progress} message={progressMsg} />
          </div>
        )}

        {state === 'error' && (
          <div style={s.errBox}>
            <div>{error}</div>
            <button style={s.retryBtn} onClick={reset}>← VOLVER</button>
          </div>
        )}

        {state === 'done' && resultado && <InformePanel resultado={resultado} onReset={reset} />}
      </div>
    </div>
  )
}
