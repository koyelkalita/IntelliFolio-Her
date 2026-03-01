"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout, SignOutButton } from "@/components/dashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { getPortfolios, getPortfolioAnalysis, getPortfolioProfile, getPortfolioSkills, getPortfolioProjects, getPortfolioSocialLinks, getPortfolioSections } from "@/lib/api";

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [userName] = useState(currentUser?.displayName || "User");
  const [portfolios, setPortfolios] = useState([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(true);

  // Real AI analysis state
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  // Real portfolio detail state
  const [activePortfolio, setActivePortfolio] = useState(null);
  const [portfolioProfile, setPortfolioProfile] = useState(null);
  const [portfolioSkills, setPortfolioSkills] = useState([]);
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [portfolioSocial, setPortfolioSocial] = useState([]);
  const [portfolioSections, setPortfolioSections] = useState([]);

  // Refresh key: increments when page becomes visible (e.g. navigating back from create page)
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setRefreshKey(k => k + 1);
      }
    };
    // Also refresh when the component mounts (navigation)
    setRefreshKey(k => k + 1);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Fetch user's portfolios (re-fetches on mount, on visibility change, and when user changes)
  useEffect(() => {
    async function fetchPortfolios() {
      try {
        if (!currentUser) return;
        const token = await currentUser.getIdToken();
        const result = await getPortfolios(token);
        if (result.status === "success") {
          setPortfolios(result.portfolios || []);
          // Reset active portfolio so it picks the newest one
          setActivePortfolio(null);
        }
      } catch (error) {
        console.error("Failed to fetch portfolios:", error);
      } finally {
        setLoadingPortfolios(false);
      }
    }

    fetchPortfolios();
  }, [currentUser, refreshKey]);

  // When portfolios load, fetch details for the best one (prefer published over draft)
  useEffect(() => {
    if (portfolios.length > 0 && !activePortfolio) {
      // Prefer published portfolios; among same status, newest first
      const sorted = [...portfolios].sort((a, b) => {
        if (a.status === "published" && b.status !== "published") return -1;
        if (b.status === "published" && a.status !== "published") return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
      const best = sorted[0];
      setActivePortfolio(best);
      fetchPortfolioDetails(best.id);
      runAnalysis(best.id);
    }
  }, [portfolios]);

  // Delete a portfolio
  async function deletePortfolio(portfolioId) {
    if (!currentUser) return;
    if (!window.confirm("Delete this portfolio? This cannot be undone.")) return;
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`http://localhost:8000/portfolios/${portfolioId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        // If we deleted the active one, reset it
        if (activePortfolio?.id === portfolioId) setActivePortfolio(null);
        const result = await fetch(`http://localhost:8000/portfolios`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await result.json();
        if (data.status === "success") setPortfolios(data.portfolios || []);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  }

  // Fetch portfolio detail data (profile, skills, projects, social, sections)
  async function fetchPortfolioDetails(portfolioId) {
    try {
      const [profile, skills, projects, social, sections] = await Promise.all([
        getPortfolioProfile(portfolioId),
        getPortfolioSkills(portfolioId),
        getPortfolioProjects(portfolioId),
        getPortfolioSocialLinks(portfolioId),
        getPortfolioSections(portfolioId),
      ]);
      setPortfolioProfile(profile);
      setPortfolioSkills(skills || []);
      setPortfolioProjects(projects || []);
      setPortfolioSocial(social || []);
      setPortfolioSections(sections || []);
    } catch (error) {
      console.error("Failed to fetch portfolio details:", error);
    }
  }

  // Run AI analysis on a portfolio
  async function runAnalysis(portfolioId) {
    if (!currentUser) return;
    setAnalysisLoading(true);
    setAnalysisError(null);
    try {
      const token = await currentUser.getIdToken();
      const result = await getPortfolioAnalysis(portfolioId, token);
      if (result.status === "success") {
        setAnalysisData(result.analysis);
      } else {
        const msg = result.message || "Analysis failed";
        setAnalysisError(
          msg.includes("API key not valid") || msg.includes("GEMINI_API_KEY") || msg.includes("AI suggestions")
            ? "AI suggestions need a valid Gemini key. Set GEMINI_API_KEY_SUGGESTIONS (or GEMINI_API_KEY) in backend/.env (get one at https://aistudio.google.com/apikey) and restart the backend."
            : msg
        );
      }
    } catch (error) {
      console.error("AI Analysis error:", error);
      const msg = error?.message || "";
      setAnalysisError(
        msg.includes("API key not valid") || msg.includes("API_KEY_INVALID") || msg.includes("AI suggestions")
          ? "AI suggestions need a valid Gemini key. Set GEMINI_API_KEY_SUGGESTIONS (or GEMINI_API_KEY) in backend/.env (get one at https://aistudio.google.com/apikey) and restart the backend."
          : "Failed to get AI analysis. Please try again."
      );
    } finally {
      setAnalysisLoading(false);
    }
  }

  // Build real checklist from actual portfolio data (check both DB tables AND merged_data)
  const checklistItems = useMemo(() => {
    const merged = portfolioProfile?.merged_data || {};
    // Projects: check DB table first, then merged_data
    const projectCount = portfolioProjects.length || (merged.projects || []).length;
    // Skills: check DB table first, then merged_data
    const skillCount = portfolioSkills.length || [
      ...(merged.technicalSkills || []),
      ...(merged.softSkills || []),
      ...(merged.languages || []),
    ].length;
    // Summary: check profile summary or merged_data summary
    const summary = portfolioProfile?.summary || merged.summary || merged.bio || "";
    const aboutWords = summary.split(/\s+/).filter(w => w.length > 0).length;
    // GitHub: check social links table or merged_data
    const hasGitHub = portfolioSocial.some(s => s.platform === "github") || !!portfolioProfile?.github_username || !!merged.social?.github;
    // Email: check profile or merged_data
    const hasEmail = !!portfolioProfile?.email || !!merged.email;

    return [
      { label: "At least 2 Projects", completed: projectCount >= 2 },
      { label: "About section > 80 words", completed: aboutWords >= 80 },
      { label: "GitHub link added", completed: hasGitHub },
      { label: "Contact email exists", completed: hasEmail },
      { label: "5+ skills listed", completed: skillCount >= 5 },
    ];
  }, [portfolioProfile, portfolioSkills, portfolioProjects, portfolioSocial, portfolioSections]);

  // Use real AI score or calculate from checklist
  const portfolioScore = useMemo(() => {
    if (analysisData?.score !== undefined) return analysisData.score;
    // Fallback: calculate from checklist while AI loads
    const completed = checklistItems.filter(i => i.completed).length;
    return Math.round((completed / checklistItems.length) * 100);
  }, [analysisData, checklistItems]);

  // Use real AI suggestions or empty while loading
  const aiSuggestions = useMemo(() => {
    if (analysisData?.suggestions && analysisData.suggestions.length > 0) {
      return analysisData.suggestions.slice(0, 4).map(s => ({
        text: typeof s === "string" ? s : s.suggestion || s.text || JSON.stringify(s),
        section: typeof s === "object" ? s.section : null,
        reason: typeof s === "object" ? s.reason : null,
      }));
    }
    // While loading, show nothing (the loading state handles it)
    return [];
  }, [analysisData]);

  // Real portfolio status from active portfolio
  const portfolioData = useMemo(() => {
    if (!activePortfolio) {
      return { status: "No Portfolio", liveUrl: null, lastUpdated: "N/A" };
    }
    return {
      status: activePortfolio.status === "published" ? "Live" : "Draft",
      liveUrl: activePortfolio.status === "published" ? `${window.location.origin}/${activePortfolio.slug}` : null,
      lastUpdated: activePortfolio.updated_at
        ? new Date(activePortfolio.updated_at).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })
        : "N/A",
    };
  }, [activePortfolio]);

  // Real resume data
  const resumeData = useMemo(() => {
    const detectedSections = [];
    if (portfolioSections.some(s => s.section_type === "experience")) detectedSections.push("Experience");
    if (portfolioProjects.length > 0) detectedSections.push("Projects");
    if (portfolioSkills.length > 0) detectedSections.push("Skills");
    if (portfolioSections.some(s => s.section_type === "education")) detectedSections.push("Education");
    if (portfolioSections.some(s => s.section_type === "certifications")) detectedSections.push("Certifications");

    return {
      uploaded: !!portfolioProfile,
      sectionsDetected: detectedSections.length > 0 ? detectedSections : ["None detected"],
      lastProcessed: activePortfolio?.created_at
        ? new Date(activePortfolio.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "N/A",
    };
  }, [portfolioProfile, portfolioSkills, portfolioProjects, portfolioSections, activePortfolio]);

  // Helper function to get score color
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-orange-500";
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-orange-500";
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userName}
              </h1>
              <p className="text-gray-500 mt-1">Your Portfolio Control Center</p>
            </div>
            <div className="flex gap-3">
              <a
                href="/dashboard/create"
                className="px-6 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors font-medium"
              >
                + Create Portfolio
              </a>
              <SignOutButton />
            </div>
          </div>

          {/* Your Portfolios Section */}
          {portfolios.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Portfolios</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolios.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    className={`bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer ${activePortfolio?.id === portfolio.id ? "border-amber-500 ring-2 ring-amber-200" : "border-gray-200"
                      }`}
                    onClick={() => {
                      setActivePortfolio(portfolio);
                      fetchPortfolioDetails(portfolio.id);
                      runAnalysis(portfolio.id);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg text-gray-900 flex-1">
                        {portfolio.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${portfolio.status === "published"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {portfolio.status === "published" ? "Published" : "Draft"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                      Created {new Date(portfolio.created_at).toLocaleDateString()}
                    </p>

                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/edit?portfolio=${portfolio.slug}`}
                          className="flex-1 px-4 py-2 text-sm font-medium text-center text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Edit
                        </Link>
                        <a
                          href={`/${portfolio.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 text-sm font-medium text-center text-white bg-stone-800 hover:bg-stone-900 rounded-lg transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View
                        </a>
                      </div>
                      <div className="flex gap-2">
                        {portfolio.status !== "published" && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                if (!currentUser) return;
                                const token = await currentUser.getIdToken();
                                const response = await fetch(
                                  `http://localhost:8000/portfolios/${portfolio.id}/publish`,
                                  {
                                    method: "POST",
                                    headers: { Authorization: `Bearer ${token}` },
                                  }
                                );
                                if (response.ok) {
                                  const result = await getPortfolios(token);
                                  if (result.status === "success") {
                                    setPortfolios(result.portfolios || []);
                                  }
                                }
                              } catch (error) {
                                console.error("Publish error:", error);
                              }
                            }}
                            className="flex-1 px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePortfolio(portfolio.id);
                          }}
                          className="flex-1 px-4 py-2 text-sm font-medium text-center text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {portfolios.length === 0 && !loadingPortfolios && (
            <section className="mb-8 p-8 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-lg text-blue-900 mb-2">No Portfolios Yet</h3>
              <p className="text-blue-800 mb-4">Create your first portfolio to get started!</p>
              <Link
                href="/dashboard/create"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Your First Portfolio
              </Link>
            </section>
          )}

          {/* Top Row - 3 Cards */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Portfolio Status */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="font-semibold text-gray-900">
                    Portfolio Status
                  </h3>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${portfolioData.status === "Live"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {portfolioData.status}
                    </span>
                  </div>

                  {portfolioData.liveUrl && (
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-gray-500">Live URL:</span>
                      <a
                        href={portfolioData.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-amber-800 hover:underline break-all"
                      >
                        {portfolioData.liveUrl}
                      </a>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <span className="text-sm text-gray-500">Last updated:</span>
                    <span className="text-sm text-gray-700">
                      {portfolioData.lastUpdated}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {activePortfolio && (
                    <>
                      <a
                        href={`/${activePortfolio.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 text-sm font-medium text-center text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Preview
                      </a>
                      <button
                        onClick={async () => {
                          if (!currentUser || !activePortfolio) return;
                          try {
                            const token = await currentUser.getIdToken();
                            await fetch(
                              `http://localhost:8000/portfolios/${activePortfolio.id}/publish`,
                              { method: "POST", headers: { Authorization: `Bearer ${token}` } }
                            );
                            const result = await getPortfolios(token);
                            if (result.status === "success") setPortfolios(result.portfolios || []);
                          } catch (error) {
                            console.error("Publish error:", error);
                          }
                        }}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-stone-800 hover:bg-stone-900 rounded-lg transition-colors"
                      >
                        Republish
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Card 2: Portfolio Strength Score */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <h3 className="font-semibold text-gray-900">
                    Portfolio Strength
                  </h3>
                </div>

                {analysisLoading ? (
                  <div className="text-center py-6">
                    <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm text-gray-500">AI is analyzing...</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <span
                        className={`text-4xl font-bold ${getScoreColor(portfolioScore)}`}
                      >
                        {portfolioScore}
                      </span>
                      <span className="text-lg text-gray-400"> / 100</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(portfolioScore)}`}
                        style={{ width: `${portfolioScore}%` }}
                      ></div>
                    </div>

                    {/* Checklist */}
                    <div className="space-y-2">
                      {checklistItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {item.completed ? (
                            <svg
                              className="w-4 h-4 text-amber-500 shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4 text-gray-800 shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          <span
                            className={`text-xs ${item.completed ? "text-gray-600" : "text-gray-500"
                              }`}
                          >
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Card 3: AI Suggestions */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
                  </div>
                  {activePortfolio && !analysisLoading && (
                    <button
                      onClick={() => runAnalysis(activePortfolio.id)}
                      className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors font-medium"
                    >
                      Re-analyze
                    </button>
                  )}
                </div>

                {analysisLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                    <p className="text-xs text-gray-400 text-center mt-2">Gemini AI is analyzing your portfolio...</p>
                  </div>
                ) : analysisError ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{analysisError}</p>
                    <button
                      onClick={() => activePortfolio && runAnalysis(activePortfolio.id)}
                      className="mt-2 text-xs text-red-600 underline"
                    >
                      Retry
                    </button>
                  </div>
                ) : aiSuggestions.length > 0 ? (
                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-amber-50 border-l-4 border-amber-600 rounded-r-lg"
                      >
                        <div className="flex-1">
                          {suggestion.section && (
                            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                              {suggestion.section}
                            </span>
                          )}
                          <p className="text-sm text-gray-700">{suggestion.text}</p>
                          {suggestion.reason && (
                            <p className="text-xs text-gray-500 mt-1 italic">{suggestion.reason}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-500">
                      {portfolios.length === 0
                        ? "Create a portfolio to get AI suggestions"
                        : "Click a portfolio above to analyze it"}
                    </p>
                  </div>
                )}

                {/* Hiring Trends & Missing Keywords */}
                {analysisData && !analysisLoading && (
                  <div className="mt-4 space-y-3">
                    {analysisData.hiring_trends_analysis && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="text-xs font-semibold text-blue-700 uppercase mb-1">Hiring Trends</h4>
                        <p className="text-xs text-blue-800">{analysisData.hiring_trends_analysis}</p>
                      </div>
                    )}

                    {analysisData.missing_keywords && analysisData.missing_keywords.length > 0 && (
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <h4 className="text-xs font-semibold text-purple-700 uppercase mb-1">Missing Keywords</h4>
                        <div className="flex flex-wrap gap-1">
                          {analysisData.missing_keywords.map((keyword, i) => (
                            <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysisData.strengths && analysisData.strengths.length > 0 && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="text-xs font-semibold text-green-700 uppercase mb-1">Strengths</h4>
                        <ul className="text-xs text-green-800 space-y-1">
                          {analysisData.strengths.map((s, i) => (
                            <li key={i}>✓ {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysisData.weaknesses && analysisData.weaknesses.length > 0 && (
                      <div className="p-3 bg-amber-50 rounded-lg">
                        <h4 className="text-xs font-semibold text-amber-700 uppercase mb-1">Areas to improve</h4>
                        <ul className="text-xs text-amber-800 space-y-1">
                          {analysisData.weaknesses.map((w, i) => (
                            <li key={i}>• {w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Resume Status Card */}
          <section className="mb-8">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="font-semibold text-gray-900">
                    Resume Processing
                  </h3>
                </div>
                <button
                  onClick={() => activePortfolio && runAnalysis(activePortfolio.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-stone-800 hover:bg-stone-900 rounded-lg transition-colors"
                >
                  Reprocess Resume
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-4">
                {/* Resume Uploaded */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${resumeData.uploaded ? "bg-amber-100" : "bg-gray-100"
                      }`}
                  >
                    {resumeData.uploaded ? (
                      <svg
                        className="w-5 h-5 text-amber-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Resume uploaded</p>
                    <p className="font-medium text-gray-900">
                      {resumeData.uploaded ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                {/* Sections Detected */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-amber-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sections detected</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {resumeData.sectionsDetected.map((section, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Last Processed */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last processed</p>
                    <p className="font-medium text-gray-900">
                      {resumeData.lastProcessed}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
