from flask import Flask, request
import requests
import PyPDF2
import re
import os




app = Flask(__name__)
if not os.path.exists("generated_portfolios"):
    os.makedirs("generated_portfolios")

# -------------------------
# Extract Resume Text
# -------------------------


def extract_contact_info(text):

    contact = {
        "email": None,
        "linkedin": None,
        "phone": None
    }

    # Extract Email
    email_match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    if email_match:
        contact["email"] = email_match.group()

    # Extract LinkedIn
    linkedin_match = re.search(r"(https?://)?(www\.)?linkedin\.com/in/[A-Za-z0-9_-]+", text)
    if linkedin_match:
        link = linkedin_match.group()
        if not link.startswith("http"):
            link = "https://" + link
        contact["linkedin"] = link

    # Extract Phone (Indian format friendly)
    phone_match = re.search(r"(\+91[\s-]?\d{10}|\b\d{10}\b)", text)
    if phone_match:
        contact["phone"] = phone_match.group()

    return contact

def extract_text_from_pdf(file):
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
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

        # Smart achievement detection (even without heading)
        if any(keyword in lower for keyword in [
            "selected", "top", "scholarship", "published",
            "award", "grant", "honor"
        ]):
            sections["achievements"] += line + "<br>"
            continue

        if current_section:
            sections[current_section] += line + "<br>"

    return sections



# -------------------------
# Generate Portfolio UI
# -------------------------
def generate_portfolio(user, repos, resume_sections, contact):


    name = user.get("name") or user.get("login")
    bio = user.get("bio") or "Passionate Developer"
    avatar = user.get("avatar_url")
    location = user.get("location") or "India"
    github_url = user.get("html_url")

    repo_cards = ""
    for repo in repos[:4]:
        repo_cards += f"""
        <div class="card">
            <h3>{repo['name']}</h3>
            <p>{repo['description'] or "No description available"}</p>
            <a href="{repo['html_url']}" target="_blank">View →</a>
        </div>
        """

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>{name} | Portfolio</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
        <style>
            body {{
                margin: 0;
                font-family: 'Poppins', sans-serif;
                background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
                color: white;
            }}

            header {{
                text-align: center;
                padding: 80px 20px;
            }}

            header img {{
                width: 150px;
                border-radius: 50%;
                border: 4px solid white;
            }}

            .section {{
                padding: 60px 8%;
            }}

            .grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 25px;
            }}

            .card {{
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(15px);
                padding: 25px;
                border-radius: 20px;
                transition: 0.3s;
                min-height: 200px;
            }}

            .card:hover {{
                transform: translateY(-8px);
                background: rgba(255,255,255,0.2);
            }}

            h2 {{
                margin-bottom: 20px;
            }}

            a {{
                color: #00f2fe;
                text-decoration: none;
            }}

            footer {{
                text-align: center;
                padding: 30px;
                opacity: 0.7;
            }}
        </style>
    </head>
    <body>

        <header>
    <img src="{avatar}">
    <h1>{name}</h1>
    <p>{bio}</p>
    <p>📍 {location}</p>

    <div style="margin-top:20px;">
        {f'<p>📧 <a href="mailto:{contact["email"]}" style="color:#00f2fe;">{contact["email"]}</a></p>' if contact["email"] else ''}
        {f'<p>💼 <a href="{contact["linkedin"]}" target="_blank" style="color:#00f2fe;">LinkedIn</a></p>' if contact["linkedin"] else ''}
        {f'<p>📱 {contact["phone"]}</p>' if contact["phone"] else ''}
    </div>

    <a href="{github_url}" target="_blank" style="color:#00f2fe;">Visit GitHub</a>
</header>


        <div class="section">
            <h2>📊 GitHub Projects</h2>
            <div class="grid">
                {repo_cards}
            </div>
        </div>

        <div class="section">
            <h2>🎓 Education</h2>
            <div class="card">{resume_sections['education'] or "Not found in resume."}</div>
        </div>

        <div class="section">
            <h2>🛠 Skills</h2>
            <div class="card">{resume_sections['skills'] or "Not found in resume."}</div>
        </div>

        <div class="section">
            <h2>🚀 Projects (From Resume)</h2>
            <div class="card">{resume_sections['projects'] or "Not found in resume."}</div>
        </div>

        <div class="section">
        <h2>🏆 Achievements</h2>
        <div class="card">
            {resume_sections['achievements'] or "Highlights and recognitions will appear here."}
        </div>
        </div>
        <div class="section">
        <h2>💼 Experience</h2>
        <div class="card">
            {resume_sections['experience'] if resume_sections['experience'] else 
            "🚀 Actively seeking challenging opportunities to apply technical skills, contribute meaningfully, and grow in a dynamic engineering environment."}
        </div>
        </div>


        <footer>
            © 2026 {name} | Smart Portfolio Generator
        </footer>

    </body>
    </html>
    """


@app.route("/generate", methods=["POST"])
def generate():

    username = request.form.get("username")
    resume_file = request.files.get("resume")

    user_res = requests.get(f"https://api.github.com/users/{username}")
    repo_res = requests.get(f"https://api.github.com/users/{username}/repos?sort=updated")

    if user_res.status_code != 200:
        return {"status": "error", "message": "GitHub user not found"}

    user_data = user_res.json()
    repo_data = repo_res.json()

    resume_text = extract_text_from_pdf(resume_file)
    resume_sections = parse_resume_sections(resume_text)
    contact_info = extract_contact_info(resume_text)

    html_content = generate_portfolio(user_data, repo_data, resume_sections, contact_info)

    filename = f"generated_portfolios/{username}.html"

    with open(filename, "w", encoding="utf-8") as f:
        f.write(html_content)

    return {
        "status": "success",
        "url": f"/portfolio/{username}"
    }

@app.route("/portfolio/<username>")
def serve_portfolio(username):
    filepath = f"generated_portfolios/{username}.html"
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()
    else:
        return "<h2>Portfolio not found.</h2>"


if __name__ == "__main__":
    app.run(debug=True)

