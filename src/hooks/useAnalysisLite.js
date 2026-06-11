import { useState, useCallback } from 'react'
import { pdfToMarkdown } from '../lib/pdfExtractor.js'
import { analizarMemoria } from '../lib/claudeClient.js'

export function useAnalysisLite() {
  const [state, setState] = useState('idle') // idle | extracting | analyzing | done | error
  const [progress, setProgress] = useState(0)
  const [progressMsg, setProgressMsg] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)
  const [fileName, setFileName] = useState('')

  const analizar = useCallback(async (file, apiKey) => {
    setError(null)
    setFileName(file.name)
    setState('extracting')
    setProgress(15)
    setProgressMsg('Extrayendo texto del PDF...')

    try {
      const markdown = await pdfToMarkdown(file)

      setState('analyzing')
      setProgress(50)
      setProgressMsg('Enviando a Claude para análisis bajo Ley 21.595...')

      const res = await analizarMemoria(markdown, apiKey, (msg) => {
        setProgressMsg(msg)
        setProgress(70)
      })

      setResultado(res)
      setState('done')
      setProgress(100)
    } catch (e) {
      setError(e.message)
      setState('error')
    }
  }, [])

  const reset = useCallback(() => {
    setState('idle')
    setProgress(0)
    setProgressMsg('')
    setResultado(null)
    setError(null)
    setFileName('')
  }, [])

  return { state, progress, progressMsg, resultado, error, fileName, analizar, reset }
}
