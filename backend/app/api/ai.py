from fastapi import APIRouter, UploadFile
from app.services.pdf_parser import extract_text_from_file
from app.agents.resume_agent import parse_resume
from app.agents.github_agent import summarize_github_profile
from app.agents.content_enhance_agent import enhance_profile_content
from app.agents.build_profile_agent import build_profile
from app.schemas.build_profile_schema import BuildProfileRequest


router = APIRouter(prefix="/ai")



@router.post("/build-profile")
async def build_profile_route(payload: BuildProfileRequest):
    return build_profile(
        resume_text=payload.resume_text,
        github_username=payload.github_username,
        resume_data=payload.resume_data,
        github_data=payload.github_data
    )

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