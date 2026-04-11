from flask import Flask, request
import requests
import PyPDF2
import re
import os

app = Flask(__name__)

# -------------------------
# Ensure portfolio folder exists
# -------------------------
if not os.path.exists("generated_portfolios"):
    os.makedirs("generated_portfolios")

# -------------------------
# GitHub Auth Headers
# -------------------------
def get_github_headers():
    headers = {"Accept": "application/vnd.github.v3+json"}
    token = os.getenv("GITHUB_API_TOKEN")
    if token:
        headers["Authorization"] = f"token {token}"
    return headers

# -------------------------
# Home Route
# -------------------------
@app.route("/")
def home():
    return """
    <h2>Smart Portfolio Generator Backend is Running</h2>
    <form action="/generate" method="post" enctype="multipart/form-data">
        GitHub Username: <input type="text" name="username" required><br><br>
        Resume (PDF): <input type="file" name="resume" required><br><br>
        <button type="submit">Generate Portfolio</button>
    </form>
    """

# -------------------------
# Extract Contact Info
# -------------------------
def extract_contact_info(text):
    contact = {"email": None, "linkedin": None, "phone": None}

    email_match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    if email_match:
        contact["email"] = email_match.group()

    linkedin_match = re.search(r"(https?://)?(www\.)?linkedin\.com/in/[A-Za-z0-9_-]+", text)
    if linkedin_match:
        link = linkedin_match.group()
        if not link.startswith("http"):
            link = "https://" + link
        contact["linkedin"] = link

    phone_match = re.search(r"(\+91[\s-]?\d{10}|\b\d{10}\b)", text)
    if phone_match:
        contact["phone"] = phone_match.group()

    return contact

# -------------------------
# Extract Text From PDF
# -------------------------
def extract_text_from_pdf(file):
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"
    return text

# -------------------------
# Parse Resume Sections
# -------------------------
def parse_resume_sections(text):
    sections = {
        "education": "",
        "skills": "",
        "projects": "",
        "experience": "",
        "achievements": ""
    }

    lines = text.split("\n")
    current_section = None

    for line in lines:
        lower = line.lower()

        if "education" in lower:
            current_section = "education"
            continue
        elif "skill" in lower:
            current_section = "skills"
            continue
        elif "project" in lower:
            current_section = "projects"
            continue
        elif "experience" in lower:
            current_section = "experience"
            continue
        elif "achievement" in lower or "award" in lower:
            current_section = "achievements"
            continue

        if current_section:
            sections[current_section] += line + "<br>"

    return sections

# -------------------------
# Generate Portfolio HTML
# -------------------------
def generate_portfolio(user, repos, resume_sections, contact):

    name = user.get("name") or user.get("login")
    bio = user.get("bio") or "Passionate Developer"
    avatar = user.get("avatar_url")
    location = user.get("location") or "India"
    github_url = user.get("html_url")

    repo_cards = ""
    for repo in repos[:4]:
        if repo.get("fork"):
            continue

        repo_cards += f"""
        <div style="border:1px solid #ddd; padding:10px; margin-bottom:10px;">
            <h3>{repo.get('name')}</h3>
            <p>{repo.get('description') or "No description available"}</p>
            <a href="{repo.get('html_url')}" target="_blank">View Repository</a>
        </div>
        """

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>{name} | Portfolio</title>
    </head>
    <body style="font-family:Arial; max-width:800px; margin:auto;">
        <h1>{name}</h1>
        <p>{bio}</p>
        <p>📍 {location}</p>
        <p><a href="{github_url}" target="_blank">Visit GitHub</a></p>

        <hr>
        <h2>Projects</h2>
        {repo_cards}

        <hr>
        <h2>Skills</h2>
        {resume_sections.get("skills")}

        <h2>Education</h2>
        {resume_sections.get("education")}
    </body>
    </html>
    """

# -------------------------
# Generate Route
# -------------------------
@app.route("/generate", methods=["POST"])
def generate():

    username = request.form.get("username")
    resume_file = request.files.get("resume")

    if not username or not resume_file:
        return {"status": "error", "message": "Username and resume required"}

    headers = get_github_headers()

    user_res = requests.get(
        f"https://api.github.com/users/{username}",
        headers=headers
    )

    if user_res.status_code != 200:
        return {
            "status": "error",
            "message": user_res.json().get("message", "GitHub API error")
        }

    repo_res = requests.get(
        f"https://api.github.com/users/{username}/repos?sort=updated",
        headers=headers
    )

    user_data = user_res.json()
    repo_data = repo_res.json()

    resume_text = extract_text_from_pdf(resume_file)
    resume_sections = parse_resume_sections(resume_text)
    contact_info = extract_contact_info(resume_text)

    html_content = generate_portfolio(
        user_data,
        repo_data,
        resume_sections,
        contact_info
    )

    filename = f"generated_portfolios/{username}.html"

    with open(filename, "w", encoding="utf-8") as f:
        f.write(html_content)

    return {
        "status": "success",
        "url": f"/portfolio/{username}"
    }

# -------------------------
# Serve Generated Portfolio
# -------------------------
@app.route("/portfolio/<username>")
def serve_portfolio(username):
    filepath = f"generated_portfolios/{username}.html"
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()
    return "<h2>Portfolio not found.</h2>"

# -------------------------
# Local Run
# -------------------------
if __name__ == "__main__":
    app.run()