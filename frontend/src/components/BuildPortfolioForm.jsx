"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { useAuth } from "@/contexts/AuthContext";

export function BuildPortfolioForm({ templateType = "professional" }) {
  const router = useRouter();
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [githubUsername, setGithubUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [portfolioSlug, setPortfolioSlug] = useState(null);

  const { build } = useApi();
  const { createPortfolio } = usePortfolio();
  const { currentUser } = useAuth();

  // Redirect to dashboard after success
  useEffect(() => {
    if (success && portfolioSlug) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, portfolioSlug, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      if (!resumeText.trim() && !resumeFile) {
        throw new Error("Please enter resume text or upload a PDF file");
      }

      if (!githubUsername.trim()) {
        throw new Error("Please enter GitHub username");
      }

      if (!currentUser) {
        throw new Error("Please sign in first");
      }

      // Get Firebase token
      const token = await currentUser.getIdToken();

      let finalResumeText = resumeText;

      // If file is uploaded, parse it first
      if (resumeFile) {
        try {
          const parseResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/ai/parse-resume`, {
            method: "POST",
            body: (() => {
              const formData = new FormData();
              formData.append("file", resumeFile);
              return formData;
            })(),
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (parseResult.ok) {
            const parsedData = await parseResult.json();
            finalResumeText = parsedData.text || parsedData.resume_text || resumeText;
          }
        } catch (parseErr) {
          console.warn("Could not parse PDF, using provided text instead:", parseErr);
        }
      }

      // Call build endpoint
      const result = await build(finalResumeText, githubUsername, templateType);

      // Check if response indicates success
      const isSuccess = result.status === "success" || result.portfolio_id || result.status !== "error";
      
      if (!isSuccess || result.status === "error") {
        throw new Error(result.message || "Failed to build portfolio");
      }

      setSuccess(true);
      setPortfolioSlug(result.portfolio_slug || "");
      setResumeText("");
      setResumeFile(null);
      setGithubUsername("");
      setLoading(false);

      // Optionally store in context (don't await, let it happen in background)
      createPortfolio(finalResumeText, githubUsername, token).catch(err => {
        console.warn("Portfolio context update failed:", err);
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Build Your Portfolio</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg border-2 border-green-500">
          <p className="font-semibold">✓ Portfolio Created Successfully!</p>
          <p className="text-sm mt-1">Your portfolio has been created. Redirecting to dashboard...</p>
          <p className="text-xs mt-2 text-green-600">Portfolio: {portfolioSlug}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* GitHub Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GitHub Username
          </label>
          <input
            type="text"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            placeholder="e.g., torvalds"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume (PDF or Text)
          </label>
          
          {/* File Upload */}
          <div className="mb-4">
            <label className="block p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-4-2l-8-8m8 8v8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm text-gray-600 mt-2">
                  {resumeFile ? (
                    <span className="text-green-600 font-medium">
                      ✓ {resumeFile.name}
                    </span>
                  ) : (
                    <>
                      <span className="text-blue-500 font-medium">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                      <br />
                      <span className="text-gray-500">(PDF up to 10MB)</span>
                    </>
                  )}
                </p>
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 10 * 1024 * 1024) {
                      setError("File must be smaller than 10MB");
                      return;
                    }
                    setResumeFile(file);
                    setError(null);
                  }
                }}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Text Input */}
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || success}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {success ? "✓ Portfolio Created! Creating another..." : loading ? "Building Portfolio..." : "Build Portfolio"}
        </button>
      </form>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
        <p className="font-medium mb-2">How it works:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Enter your GitHub username to fetch your profile & repos</li>
          <li>Upload a PDF resume OR paste resume text (optional)</li>
          <li>Our AI will parse and merge the data</li>
          <li>Your portfolio will be auto-generated and saved</li>
        </ul>
      </div>
    </div>
  );
}
