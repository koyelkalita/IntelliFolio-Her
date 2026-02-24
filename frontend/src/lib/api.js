/**
 * API client for backend integration
 * Base URL: http://localhost:8000
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Generic fetch wrapper with error handling
 */
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
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
    const response = await fetch(`${API_BASE_URL}/ai/parse-resume`, {
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
export async function getPortfolios(firebaseToken) {
  return apiCall("/portfolios", {
    headers: {
      Authorization: `Bearer ${firebaseToken}`,
    },
  });
}

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

