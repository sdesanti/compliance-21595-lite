# Compliance 21595 Lite — Proyecto B

Versión estática (sin backend) del analizador de memorias anuales bajo **Ley 21.595**.
100% en el browser, deploy directo en GitHub Pages.

## Diferencias con Proyecto A

| | Proyecto A | Proyecto B (Lite) |
|---|---|---|
| Backend | Python + MCP | ❌ Sin backend |
| Búsqueda CMF | ✓ | ❌ |
| Fuente PDF | URL CMF | Upload manual |
| API Key | En `.env` del servidor | En sessionStorage |
| Deploy | Servidor + Pages | Solo Pages |

## Levantar localmente

```bash
npm install
npm run dev
# → http://localhost:5173
```

Al abrir la app, se pedirá la API key de Anthropic (`sk-ant-...`).
La key se guarda solo en `sessionStorage` del browser — nunca sale del equipo.

## Deploy en GitHub Pages

```bash
gh repo create compliance-21595-lite --private
git init && git add . && git commit -m "feat: initial commit"
git remote add origin https://github.com/TU_USUARIO/compliance-21595-lite.git
git push -u origin main
```

En GitHub: Settings → Pages → Source: GitHub Actions

URL: `https://TU_USUARIO.github.io/compliance-21595-lite/`

## Uso

1. Ingresar API key de Anthropic
2. Arrastrar o seleccionar PDF de memoria anual
3. El sistema extrae el texto y llama a Claude
4. Se genera el Informe de Compliance con score por dimensión
