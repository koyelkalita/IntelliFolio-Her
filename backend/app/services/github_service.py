import requests
from fastapi import HTTPException
import base64


GITHUB_API_BASE = "https://api.github.com"


def fetch_user_profile(username: str):
    url = f"{GITHUB_API_BASE}/users/{username}"

    response = requests.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="GitHub user not found")

    data = response.json()
    return {
        "name": data.get("name"),
        "bio": data.get("bio"),
        "location": data.get("location"),
        "company": data.get("company"),
        "avatar_url": data.get("avatar_url"),
        "profile_url": data.get("html_url"),
        "followers": data.get("followers"),
        "following": data.get("following"),
        "public_repos": data.get("public_repos")
    }

def fetch_profile_readme(username: str):
    url = f"{GITHUB_API_BASE}/repos/{username}/{username}/contents/README.md"

    response = requests.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="GitHub user readme not found")

    data = response.json()
    content = base64.b64decode(data["content"])
    return content[:4000].decode("utf-8", errors="ignore")


def fetch_user_repos(username: str):
    url = f"{GITHUB_API_BASE}/users/{username}/repos"

    response = requests.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="GitHub user not found")

    repos = response.json()

    simplified = []
    for repo in repos:
        if repo.get("fork"):
            continue 

        simplified.append({
            "name": repo.get("name"),
            "description": repo.get("description"),
            "language": repo.get("language"),
            "stars": repo.get("stargazers_count"),
            "topics": repo.get("topics", []),
            "url": repo.get("html_url")
        })

    return simplified