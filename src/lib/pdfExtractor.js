import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const numPages = pdf.numPages
  const pages = []

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text = content.items.map((item) => item.str).join(' ')
    pages.push(`<!-- Página ${i} -->\n${text}`)
  }

  return pages.join('\n\n')
}

export async function pdfToMarkdown(file) {
  const raw = await extractTextFromPDF(file)
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean)
  const md = []

  for (const line of lines) {
    if (line.startsWith('<!--')) {
      md.push('\n' + line)
    } else if (/^\d+\.\d+(\.\d+)?\s+[A-ZÁÉÍÓÚ]/.test(line)) {
      const depth = (line.match(/\./g) || []).length
      md.push('#'.repeat(depth + 2) + ' ' + line)
    } else {
      md.push(line)
    }
  }

  return md.join('\n')
}
