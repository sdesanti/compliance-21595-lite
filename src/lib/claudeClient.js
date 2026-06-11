const GROQ_MODEL = 'llama-3.3-70b-versatile'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

const DIMENSIONES = [
  { id: 'mpd', nombre: 'Modelo de Prevención del Delito', descripcion: 'Existencia, actualización y cobertura del MPD post-2024' },
  { id: 'gobierno', nombre: 'Gobierno Corporativo', descripcion: 'Composición directorio, independencia, conflictos de interés' },
  { id: 'info_privilegiada', nombre: 'Información Privilegiada', descripcion: 'Políticas de manejo y restricciones de transacciones' },
  { id: 'auditoria', nombre: 'Auditoría y Contabilidad', descripcion: 'Auditores externos, observaciones, cambios de auditor' },
  { id: 'denuncias', nombre: 'Canal de Denuncias', descripcion: 'Canal de whistleblowers y protección de denunciantes' },
  { id: 'riesgos', nombre: 'Riesgos Declarados', descripcion: 'Mención de riesgos penales o regulatorios post-ley' },
  { id: 'partes_relacionadas', nombre: 'Partes Relacionadas', descripcion: 'Operaciones entre partes y aprobación del directorio' },
  { id: 'cultura', nombre: 'Cultura de Compliance', descripcion: 'Capacitación, ética corporativa, compromisos declarados' },
]

export async function analizarMemoria(textoMarkdown, apiKey, onProgress) {
  const dimsText = DIMENSIONES.map((d, i) => `${i + 1}. **${d.nombre}**: ${d.descripcion}`).join('\n')

  const prompt = `Eres un experto en compliance y derecho corporativo chileno especializado en la Ley 21.595 de Delitos Económicos (vigente desde agosto 2023).

Analiza la siguiente memoria anual de empresa chilena y evalúa cada una de estas 8 dimensiones:

${dimsText}

Para cada dimensión devuelve:
- score: número del 0 al 10 (10 = excelente cumplimiento, 0 = ausencia total)
- hallazgos: array de strings con observaciones concretas
- citas: array de citas textuales del documento (máximo 2 por dimensión)
- alertas: array de alertas críticas si las hay (vacío si no hay)

Responde ÚNICAMENTE con un objeto JSON válido con esta estructura:
{
  "empresa": "nombre de la empresa",
  "anio": "año de la memoria",
  "score_global": número,
  "resumen_ejecutivo": "2-3 oraciones con evaluación general",
  "dimensiones": [
    { "id": "mpd", "nombre": "...", "score": 0-10, "hallazgos": [], "citas": [], "alertas": [] }
  ],
  "alertas_criticas": []
}

MEMORIA A ANALIZAR:
${textoMarkdown.slice(0, 24000)}`

  onProgress?.('Enviando a Groq (Llama 3.3) para análisis...')

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4096,
      temperature: 0.2,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Error API Groq: ${res.status}`)
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) throw new Error('Groq no devolvió contenido')

  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Groq no devolvió JSON válido')
  return JSON.parse(jsonMatch[0])
}

export { DIMENSIONES }
