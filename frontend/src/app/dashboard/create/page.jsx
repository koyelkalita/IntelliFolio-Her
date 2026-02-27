"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard";
import { BuildPortfolioForm } from "@/components/BuildPortfolioForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function CreatePortfolioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Portfolio
              </h1>
              <p className="text-gray-500 mt-1">
                {selectedTemplate 
                  ? `Choose ${selectedTemplate} template - Upload your resume and GitHub profile` 
                  : "Select a template to get started"}
              </p>
            </div>
          </div>

          {/* Template Selection Step */}
          {!selectedTemplate ? (
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Portfolio Template</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Professional Template */}
                <div
                  onClick={() => setSelectedTemplate("professional")}
                  className="relative group cursor-pointer"
                >
                  <div className="bg-white border-2 border-gray-200 hover:border-stone-800 rounded-xl overflow-hidden transition-all hover:shadow-lg">
                    {/* Preview */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-700 h-64 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-4xl font-bold mb-2">John.D</div>
                        <div className="text-lg text-gray-300">Professional Developer</div>
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Professional</h3>
                      <p className="text-gray-600 mb-4">
                        A sleek, dark-themed portfolio perfect for developers and tech professionals. Features clean navigation and emphasis on projects.
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Dark theme
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Smooth animations
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Project showcase
                        </li>
                      </ul>
                      <button className="w-full mt-6 px-4 py-3 bg-stone-800 text-white font-medium rounded-lg hover:bg-stone-900 transition-colors">
                        Choose Professional
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contemporary Template */}
                <div
                  onClick={() => setSelectedTemplate("contemporary")}
                  className="relative group cursor-pointer"
                >
                  <div className="bg-white border-2 border-gray-200 hover:border-blue-600 rounded-xl overflow-hidden transition-all hover:shadow-lg">
                    {/* Preview */}
                    <div className="bg-white border-b border-gray-200 h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">Jane Smith</div>
                        <div className="text-lg text-gray-600">Creative Designer & Developer</div>
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Contemporary</h3>
                      <p className="text-gray-600 mb-4">
                        A clean, light minimal portfolio with focus on simplicity and elegance. Perfect for showcasing your work and professional information.
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Light, clean design
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Minimal aesthetic
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Focused on content
                        </li>
                      </ul>
                      <button className="w-full mt-6 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        Choose Contemporary
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Form Section - shows after template selection */
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedTemplate === "professional" ? "Professional" : "Contemporary"} Portfolio
                </h2>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Change Template
                </button>
              </div>
              <BuildPortfolioForm templateType={selectedTemplate} />
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
