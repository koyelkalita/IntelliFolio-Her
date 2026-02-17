"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DashboardLayout, SignOutButton } from "@/components/dashboard";

export default function DashboardPage() {
  const [userName] = useState("Koyel Kalita");

  // Mock portfolio data
  const portfolioData = {
    status: "Draft", // "Draft" or "Live"
    liveUrl: null, // e.g., "https://intellifolio.app/koyel-kalita"
    lastUpdated: "February 15, 2026 at 3:45 PM",
  };

  // Mock checklist data
  const checklistItems = [
    { label: "At least 2 Projects", completed: true },
    { label: "About section > 80 words", completed: false },
    { label: "GitHub link added", completed: true },
    { label: "Contact email exists", completed: true },
    { label: "5+ skills listed", completed: false },
  ];

  // Mock portfolio score (random between 60-85, generated client-side to avoid hydration mismatch)
  const [portfolioScore, setPortfolioScore] = useState(72);

  useEffect(() => {
    setPortfolioScore(Math.floor(Math.random() * 26) + 60);
  }, []);

  // Generate AI suggestions based on mock conditions
  const aiSuggestions = useMemo(() => {
    const suggestions = [];
    if (!checklistItems[0].completed) {
      suggestions.push({
        text: "Add at least one more project to showcase your work",
      });
    }
    if (!checklistItems[1].completed) {
      suggestions.push({
        text: "Expand your About section to at least 80 words",
      });
    }
    if (!checklistItems[2].completed) {
      suggestions.push({
        text: "Add your GitHub profile link to boost credibility",
      });
    }
    if (!checklistItems[4].completed) {
      suggestions.push({
        text: "List at least 5 skills to better represent your expertise",
      });
    }
    // Always add some general suggestions if we have less than 3
    if (suggestions.length < 3) {
      suggestions.push({
        text: "Quantify your achievements with metrics and numbers",
      });
    }
    if (suggestions.length < 3) {
      suggestions.push({
        text: "Add action verbs to make your experience more impactful",
      });
    }
    return suggestions.slice(0, 3);
  }, []);

  // Mock resume data
  const resumeData = {
    uploaded: true,
    sectionsDetected: ["Experience", "Projects", "Skills", "Education"],
    lastProcessed: "February 14, 2026",
  };

  // Helper function to get score color
  const getScoreColor = (score) => {
    if (score >= 80) return "text-amber-600";
    if (score >= 70) return "text-yellow-600";
    return "text-orange-500";
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "bg-amber-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
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
          <SignOutButton />
        </div>

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
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      portfolioData.status === "Live"
                        ? "bg-amber-100 text-amber-700"
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
                <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  Preview
                </button>
                <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-stone-800 hover:bg-stone-900 rounded-lg transition-colors">
                  Republish
                </button>
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
                  className={`h-2 rounded-full ${getProgressColor(portfolioScore)}`}
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
                      className={`text-xs ${
                        item.completed ? "text-gray-600" : "text-gray-500"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: AI Suggestions */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
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

              <div className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-amber-50 border-l-4 border-amber-600 rounded-r-lg"
                  >
                    <span className="text-lg shrink-0">{suggestion.icon}</span>
                    <p className="text-sm text-gray-700">{suggestion.text}</p>
                  </div>
                ))}
              </div>
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
              <button className="px-4 py-2 text-sm font-medium text-white bg-stone-800 hover:bg-stone-900 rounded-lg transition-colors">
                Reprocess Resume
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-4">
              {/* Resume Uploaded */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    resumeData.uploaded ? "bg-amber-100" : "bg-gray-100"
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
  );
}
