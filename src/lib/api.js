export async function generatePortfolio(data) {
  try {
    const res = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    return { status: "error", message: "Server error" };
  }
}

