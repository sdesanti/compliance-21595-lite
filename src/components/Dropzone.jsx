import { useRef, useState } from 'react'

const s = {
  zone: (drag) => ({
    border: `2px dashed ${drag ? 'var(--blue)' : 'var(--border)'}`,
    borderRadius: 12, padding: '56px 32px', textAlign: 'center', cursor: 'pointer',
    background: drag ? 'var(--bg2)' : 'transparent', transition: 'all 0.2s',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
  }),
  icon: { fontSize: 48, opacity: 0.5 },
  title: { fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text)' },
  sub: { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text2)' },
  btn: {
    background: 'var(--blue)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 600,
    fontSize: 13, padding: '10px 24px', border: 'none', borderRadius: 6, cursor: 'pointer',
  },
}

export default function Dropzone({ onFile }) {
  const [drag, setDrag] = useState(false)
  const ref = useRef()

  const handle = (file) => {
    if (file?.type === 'application/pdf') onFile(file)
  }

  return (
    <div
      style={s.zone(drag)}
      onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]) }}
      onClick={() => ref.current.click()}
    >
      <div style={s.icon}>📄</div>
      <div style={s.title}>Arrastra aquí la Memoria Anual</div>
      <div style={s.sub}>Formato PDF · La empresa puede ser cualquier sociedad chilena</div>
      <button style={s.btn} onClick={(e) => { e.stopPropagation(); ref.current.click() }}>
        SELECCIONAR PDF
      </button>
      <input ref={ref} type="file" accept="application/pdf" hidden onChange={(e) => handle(e.target.files[0])} />
    </div>
  )
}
