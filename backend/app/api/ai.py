from fastapi import APIRouter, UploadFile
from app.services.pdf_parser import extract_text_from_file
from app.agents.resume_agent import parse_resume

router = APIRouter(prefix="/ai")




@router.post("/parse-resume")
async def parse_resume_route(file: UploadFile):
    text = await extract_text_from_file(file)
    structured_data = parse_resume(text)

    return structured_data