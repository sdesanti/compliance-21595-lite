const s = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 10 },
  msg: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text2)' },
  track: { height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' },
  fill: (pct) => ({
    height: '100%', width: `${pct}%`, background: 'var(--blue)',
    borderRadius: 2, transition: 'width 0.6s ease',
  }),
  pct: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)', textAlign: 'right' },
}

export default function ProgressBar({ progress, message }) {
  return (
    <div style={s.wrap}>
      <div style={s.msg}>{message || 'Procesando...'}</div>
      <div style={s.track}>
        <div style={s.fill(progress)} />
      </div>
      <div style={s.pct}>{progress}%</div>
    </div>
  )
}
