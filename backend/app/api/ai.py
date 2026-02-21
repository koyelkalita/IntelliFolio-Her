from fastapi import APIRouter, UploadFile
from app.services.pdf_parser import extract_text_from_file
from app.agents.resume_agent import parse_resume
from app.agents.github_agent import summarize_github_profile
from app.agents.content_enhance_agent import enhance_profile_content

router = APIRouter(prefix="/ai")

@router.post("/enhance-profile")
async def enhance_profile(profile_data: dict):
    enhanced_content = enhance_profile_content(profile_data)
    return enhanced_content


@router.get("/github-profile/{username}")
async def get_github_profile(username: str):
    return summarize_github_profile(username)


@router.post("/parse-resume")
async def parse_resume_route(file: UploadFile):
    text = await extract_text_from_file(file)
    structured_data = parse_resume(text)

    return structured_data