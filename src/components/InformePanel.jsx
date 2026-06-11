import { useState } from 'react'

const scoreColor = (s) => {
  if (s >= 7) return 'var(--green)'
  if (s >= 5) return '#d4820a'
  return 'var(--alert)'
}

const ts = () => {
  const d = new Date()
  return `EXP-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`
}

const s = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 32 },
  header: {
    borderBottom: '2px solid var(--text)', paddingBottom: 20,
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16,
  },
  expNum: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', letterSpacing: 2 },
  title: { fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text)', lineHeight: 1.2 },
  score: (s) => ({
    fontFamily: 'var(--font-display)', fontSize: 56, color: scoreColor(s), lineHeight: 1,
  }),
  scoreLabel: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', letterSpacing: 2, marginTop: 4 },
  resumen: {
    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8,
    padding: '20px 24px', fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.8, color: 'var(--text2)',
  },
  alertasBox: {
    border: '1px solid var(--alert)', borderRadius: 8, padding: '16px 20px',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  alertaLabel: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--alert)', letterSpacing: 2 },
  alertaItem: { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--alert)', paddingLeft: 12, borderLeft: '2px solid var(--alert)' },
  dimLabel: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', letterSpacing: 2, marginBottom: 16 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 },
  card: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' },
  cardHead: { padding: '14px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardName: { fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--text)' },
  cardScore: (sc) => ({ fontFamily: 'var(--font-mono)', fontSize: 20, color: scoreColor(sc) }),
  cardBody: { padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 10 },
  secLabel: { fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text2)', letterSpacing: 2, marginTop: 6 },
  hallazgo: { fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text2)', paddingLeft: 12, borderLeft: '2px solid var(--border)', lineHeight: 1.5 },
  cita: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)', background: 'var(--bg3)', padding: '8px 12px', borderRadius: 4, fontStyle: 'italic' },
  alerta: { fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--alert)', paddingLeft: 12, borderLeft: '2px solid var(--alert)' },
  btnNuevo: {
    background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)',
    fontFamily: 'var(--font-mono)', fontSize: 12, padding: '10px 20px', borderRadius: 6,
    cursor: 'pointer', letterSpacing: 1,
  },
}

function DimCard({ dim }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={s.card}>
      <div style={s.cardHead} onClick={() => setOpen(!open)}>
        <div style={s.cardName}>{dim.nombre}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={s.cardScore(dim.score)}>{dim.score}/10</div>
          <span style={{ color: 'var(--text2)' }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>
      {open && (
        <div style={s.cardBody}>
          {dim.hallazgos?.length > 0 && <>
            <div style={s.secLabel}>HALLAZGOS</div>
            {dim.hallazgos.map((h, i) => <div key={i} style={s.hallazgo}>{h}</div>)}
          </>}
          {dim.citas?.length > 0 && <>
            <div style={s.secLabel}>CITAS TEXTUALES</div>
            {dim.citas.map((c, i) => <div key={i} style={s.cita}>"{c}"</div>)}
          </>}
          {dim.alertas?.length > 0 && <>
            <div style={{ ...s.secLabel, color: 'var(--alert)' }}>ALERTAS</div>
            {dim.alertas.map((a, i) => <div key={i} style={s.alerta}>{a}</div>)}
          </>}
        </div>
      )}
    </div>
  )
}

export default function InformePanel({ resultado, onReset }) {
  const expId = ts()
  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <div style={s.expNum}>INFORME N° {expId} · LEY 21.595</div>
          <div style={s.title}>{resultado.empresa}<br /><span style={{ fontSize: 18, fontStyle: 'italic' }}>Memoria {resultado.anio}</span></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={s.score(resultado.score_global)}>{resultado.score_global}</div>
          <div style={s.scoreLabel}>SCORE GLOBAL /10</div>
        </div>
      </div>

      <div style={s.resumen}>{resultado.resumen_ejecutivo}</div>

      {resultado.alertas_criticas?.length > 0 && (
        <div style={s.alertasBox}>
          <div style={s.alertaLabel}>ALERTAS CRÍTICAS</div>
          {resultado.alertas_criticas.map((a, i) => <div key={i} style={s.alertaItem}>{a}</div>)}
        </div>
      )}

      <div>
        <div style={s.dimLabel}>ANÁLISIS POR DIMENSIÓN</div>
        <div style={s.grid}>
          {resultado.dimensiones?.map((d) => <DimCard key={d.id} dim={d} />)}
        </div>
      </div>

      <button style={s.btnNuevo} onClick={onReset}>← ANALIZAR OTRO DOCUMENTO</button>
    </div>
  )
}
