import requests
import base64
import os


GITHUB_API_BASE = "https://api.github.com"


def _get_headers():
    """Get GitHub API headers with optional auth token for higher rate limits."""
    headers = {"Accept": "application/vnd.github.v3+json"}
    token = os.getenv("GITHUB_API_TOKEN", "").strip()
    if token:
        headers["Authorization"] = f"token {token}"
    return headers


def fetch_user_profile(username: str):
    url = f"{GITHUB_API_BASE}/users/{username}"
    response = requests.get(url, headers=_get_headers(), timeout=10)

    if response.status_code != 200:
        print(f"GitHub user '{username}' not found (status {response.status_code})")
        return {
            "name": username,
            "bio": None,
            "location": None,
            "company": None,
            "avatar_url": None,
            "profile_url": f"https://github.com/{username}",
            "followers": 0,
            "following": 0,
            "public_repos": 0,
        }

    data = response.json()
    return {
        "name": data.get("name") or username,
        "bio": data.get("bio"),
        "location": data.get("location"),
        "company": data.get("company"),
        "avatar_url": data.get("avatar_url"),
        "profile_url": data.get("html_url"),
        "followers": data.get("followers"),
        "following": data.get("following"),
        "public_repos": data.get("public_repos"),
    }


def fetch_profile_readme(username: str):
    url = f"{GITHUB_API_BASE}/repos/{username}/{username}/contents/README.md"
    response = requests.get(url, headers=_get_headers(), timeout=10)

    if response.status_code != 200:
        return ""  # No README, return empty string instead of throwing

    data = response.json()
    try:
        content = base64.b64decode(data["content"])
        return content[:4000].decode("utf-8", errors="ignore")
    except Exception:
        return ""


def fetch_user_repos(username: str):
    url = f"{GITHUB_API_BASE}/users/{username}/repos"
    response = requests.get(url, headers=_get_headers(), timeout=10)

    if response.status_code != 200:
        print(f"Could not fetch repos for '{username}' (status {response.status_code})")
        return []  # Return empty list instead of throwing

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
            "url": repo.get("html_url"),
            "html_url": repo.get("html_url"),
        })

    return simplified