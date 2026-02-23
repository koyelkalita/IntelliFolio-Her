import fitz  # PyMuPDF
from fastapi import UploadFile, HTTPException


async def extract_text_from_file(file: UploadFile) -> str:
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    try:
        file_bytes = await file.read()
        document = fitz.open(stream=file_bytes, filetype="pdf")

        text = ""
        for page in document:
            text += page.get_text()

        document.close()

        return text.strip()

    except Exception:
        raise HTTPException(status_code=500, detail="Failed to parse PDF")