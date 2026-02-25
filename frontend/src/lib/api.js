const API_BASE = "http://localhost:8000";

// ─── Generate Portfolio ───
export async function generatePortfolio(data) {
  try {
    const res = await fetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { status: "error", message: "Server error" };
  }
}

// ─── Authenticated Portfolio Endpoints ───
export async function getPortfolios(token) {
  try {
    const res = await fetch(`${API_BASE}/portfolios`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    return { status: "error", message: "Server error" };
  }
}

// ─── CRUD Fetch Endpoints (no auth required) ───

export async function getPortfolioProfile(portfolioId) {
  try {
    const res = await fetch(`${API_BASE}/api/portfolios/${portfolioId}/profile`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch profile");
    return await res.json();
  } catch (err) {
    console.error("getPortfolioProfile error:", err);
    return null;
  }
}

export async function getPortfolioSkills(portfolioId) {
  try {
    const res = await fetch(`${API_BASE}/api/portfolios/${portfolioId}/skills`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function getPortfolioProjects(portfolioId) {
  try {
    const res = await fetch(`${API_BASE}/api/portfolios/${portfolioId}/projects`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function getPortfolioSocialLinks(portfolioId) {
  try {
    const res = await fetch(`${API_BASE}/api/portfolios/${portfolioId}/social-links`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function getPortfolioSections(portfolioId) {
  try {
    const res = await fetch(`${API_BASE}/api/portfolios/${portfolioId}/sections`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

// ─── CRUD Save Endpoints ───

export async function saveProfileData(portfolioId, data) {
  const res = await fetch(`${API_BASE}/api/portfolios/${portfolioId}/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save profile");
  return await res.json();
}

export async function deleteSkill(skillId) {
  await fetch(`${API_BASE}/api/skills/${skillId}`, { method: "DELETE" });
}

export async function bulkCreateSkills(portfolioId, skills) {
  if (!skills.length) return [];
  const res = await fetch(`${API_BASE}/api/portfolios/${portfolioId}/skills/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(skills),
  });
  if (!res.ok) throw new Error("Failed to save skills");
  return await res.json();
}

export async function deleteSocialLink(linkId) {
  await fetch(`${API_BASE}/api/social-links/${linkId}`, { method: "DELETE" });
}

export async function bulkCreateSocialLinks(portfolioId, links) {
  if (!links.length) return [];
  const res = await fetch(`${API_BASE}/api/portfolios/${portfolioId}/social-links/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(links),
  });
  if (!res.ok) throw new Error("Failed to save social links");
  return await res.json();
}

export async function createSection(portfolioId, data) {
  const res = await fetch(`${API_BASE}/api/portfolios/${portfolioId}/sections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create section");
  return await res.json();
}

export async function updateSection(sectionId, data) {
  const res = await fetch(`${API_BASE}/api/sections/${sectionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update section");
  return await res.json();
}

export async function deleteSection(sectionId) {
  await fetch(`${API_BASE}/api/sections/${sectionId}`, { method: "DELETE" });
}

export async function createProject(portfolioId, data) {
  const res = await fetch(`${API_BASE}/api/portfolios/${portfolioId}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create project");
  return await res.json();
}

export async function deleteProject(projectId) {
  await fetch(`${API_BASE}/api/projects/${projectId}`, { method: "DELETE" });
}

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    throw error;
  }
}

/**
 * Health check
 */
export async function checkHealth() {
  return apiCall("/health");
}

/**
 * Build portfolio from resume + GitHub
 */
export async function buildPortfolio(resumeText, githubUsername, firebaseToken, templateType = "professional") {
  return apiCall("/ai/build-profile", {
    method: "POST",
    body: JSON.stringify({
      resume_text: resumeText,
      github_username: githubUsername,
      template_type: templateType,
    }),
    headers: {
      Authorization: `Bearer ${firebaseToken}`,
    },
  });
}

/**
 * Enhance profile with AI
 */
export async function enhanceProfile(profileData, firebaseToken) {
  return apiCall("/ai/enhance-profile", {
    method: "POST",
    body: JSON.stringify(profileData),
    headers: {
      Authorization: `Bearer ${firebaseToken}`,
    },
  });
}

/**
 * Get GitHub profile
 */
export async function getGitHubProfile(username) {
  return apiCall(`/ai/github-profile/${username}`);
}

/**
 * Parse resume PDF
 */
export async function parseResume(file, firebaseToken) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE}/ai/parse-resume`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Resume parse error:", error);
    throw error;
  }
}

/**
 * Get user portfolios
 */
// export async function getPortfolios(firebaseToken) {
//   return apiCall("/portfolios", {
//     headers: {
//       Authorization: `Bearer ${firebaseToken}`,
//     },
//   });
// }

/**
 * Get single portfolio
 */
export async function getPortfolio(portfolioId, firebaseToken) {
  return apiCall(`/portfolios/${portfolioId}`, {
    headers: {
      Authorization: `Bearer ${firebaseToken}`,
    },
  });
}

/**
 * Get public portfolio by slug (no authentication required)
 */
export async function getPublicPortfolio(slug) {
  return apiCall(`/portfolios/public/${slug}`);
}

/**
 * Update portfolio
 */
export async function updatePortfolio(portfolioId, updates, firebaseToken) {
  return apiCall(`/portfolios/${portfolioId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
    headers: {
      Authorization: `Bearer ${firebaseToken}`,
    },
  });
}

/**
 * Publish portfolio
 */
export async function publishPortfolio(portfolioId, firebaseToken) {
  return apiCall(`/portfolios/${portfolioId}/publish`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${firebaseToken}`,
    },
  });
}