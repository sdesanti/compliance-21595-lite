"""Backend de conversión PDF → Markdown para Compliance 21595."""

import os
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pymupdf4llm

app = FastAPI(title="Compliance 21595 — PDF Converter")

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5177",
    "https://compliance-21595-lite.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "converter": "pymupdf4llm"}


@app.post("/convert")
async def convert_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Solo se aceptan archivos PDF")

    content = await file.read()
    if len(content) > 50 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="PDF demasiado grande (máx 50 MB)")

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(content)
        tmp_path = Path(tmp.name)

    try:
        markdown = pymupdf4llm.to_markdown(str(tmp_path))
        return {
            "markdown": markdown,
            "chars": len(markdown),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al convertir PDF: {str(e)}")
    finally:
        tmp_path.unlink(missing_ok=True)


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
