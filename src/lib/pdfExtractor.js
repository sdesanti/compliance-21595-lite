/**
 * Convierte un PDF a Markdown.
 * - En desarrollo: usa proxy Vite /api/convert → localhost:8000
 * - En producción (Vercel): llama directo a Railway
 * - Fallback: extracción básica con pdf.js si el backend no responde
 */

import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

const RAILWAY_URL = 'https://compliance-21595-backend-production.up.railway.app'

function getBackendUrl() {
  // En desarrollo Vite proxy maneja /api → localhost:8000
  // En producción apuntamos directo a Railway
  if (import.meta.env.DEV) return '/api/convert'
  return `${RAILWAY_URL}/convert`
}

async function extractWithBackend(file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(getBackendUrl(), {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Error backend: ${res.status}`)
  }

  const data = await res.json()
  return data.markdown
}

async function extractWithPdfJs(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text = content.items.map((item) => item.str).join(' ')
    pages.push(`<!-- Página ${i} -->\n${text}`)
  }

  const raw = pages.join('\n\n')
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n')
}

export async function pdfToMarkdown(file, onStatus) {
  try {
    onStatus?.('Convirtiendo PDF con pymupdf4llm (análisis completo)...')
    const md = await extractWithBackend(file)
    onStatus?.('Conversión completa — documento listo para análisis.')
    return md
  } catch (e) {
    console.warn('Backend no disponible, usando pdf.js básico:', e.message)
  }

  onStatus?.('Extrayendo texto con pdf.js (modo básico)...')
  const md = await extractWithPdfJs(file)
  onStatus?.('Extracción básica completa.')
  return md
}
