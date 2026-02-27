"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  buildPortfolio,
  enhanceProfile,
  getGitHubProfile,
  parseResume,
  checkHealth,
} from "@/lib/api";
import { useCallback } from "react";

/**
 * Custom hook for API calls with automatic Firebase token injection
 */
export function useApi() {
  const { currentUser } = useAuth();

  /**
   * Get Firebase token for API authentication
   */
  const getToken = useCallback(async () => {
    if (!currentUser) throw new Error("User not authenticated");
    return await currentUser.getIdToken();
  }, [currentUser]);

  /**
   * Check backend health
   */
  const health = useCallback(async () => {
    return checkHealth();
  }, []);

  /**
   * Build portfolio
   */
  const build = useCallback(
    async (resumeText, githubUsername, templateType = "professional") => {
      const token = await getToken();
      return buildPortfolio(resumeText, githubUsername, token, templateType);
    },
    [getToken]
  );

  /**
   * Enhance profile
   */
  const enhance = useCallback(
    async (profileData) => {
      const token = await getToken();
      return enhanceProfile(profileData, token);
    },
    [getToken]
  );

  /**
   * Get GitHub profile
   */
  const github = useCallback(async (username) => {
    return getGitHubProfile(username);
  }, []);

  /**
   * Parse resume
   */
  const resume = useCallback(
    async (file) => {
      const token = await getToken();
      return parseResume(file, token);
    },
    [getToken]
  );

  return {
    health,
    build,
    enhance,
    github,
    resume,
  };
}
