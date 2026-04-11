import json
from jinja2 import Environment, FileSystemLoader

def load_profile_data(filepath="dummy.json"):
    with open(filepath, "r", encoding="utf-8") as file:
        return json.load(file)

def generate_portfolio(profile_data, output_path="output.html"):
    """
    Generates a portfolio HTML file from profile data.
    profile_data: dict (should match /generator/portfolios/{id} -> content)
    output_path: where to save generated HTML
    """

    env = Environment(loader=FileSystemLoader("templates"))
    template = env.get_template("portfolio.html")

    rendered_html = template.render(profile=profile_data)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(rendered_html)

    return output_path


if __name__ == "__main__":
    # Only for local testing
    data = load_profile_data()
    path = generate_portfolio(data)
    print(f"Portfolio generated at {path}")
