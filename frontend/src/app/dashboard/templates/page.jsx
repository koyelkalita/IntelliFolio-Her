"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard";

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: "contemporary",
      name: "Contemporary",
      description: "Modern and sleek design with animated backgrounds",
      preview: "/templates/contemporary-preview.png",
      hasAnimatedBg: true,
    },
    {
      id: "professional",
      name: "Professional",
      description: "Clean and elegant layout for a professional look",
      preview: "/templates/professional-preview.png",
      hasAnimatedBg: false,
    },
  ];

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    // Redirect to the selected template preview
    router.push(`/dashboard/templates/${templateId}`);
  };

  return (
    <DashboardLayout
      fixedSidebar={true}
      showMenuButton={true}
      showHeader={true}
      headerBackLink="/dashboard/edit"
      headerBackText="Edit Portfolio"
    >
      {/* Template Selection Content */}
      <div className="p-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Choose Your Template
          </h1>
          <p className="text-gray-600 text-lg">
            Select a design that best represents your style
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm border-2 transition-all duration-300 hover:shadow-lg ${
                selectedTemplate === template.id
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Template Preview */}
              <div className="aspect-[4/3] bg-gray-900 relative overflow-hidden">
                {template.id === "contemporary" ? (
                  // Contemporary Template Preview
                  <div className="w-full h-full bg-black flex flex-col items-center justify-center p-6 relative">
                    {/* Header mockup */}
                    <div className="absolute top-3 left-4 right-4 flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-red-500"></div>
                        <span className="text-white text-[8px]">The Musk</span>
                      </div>
                      <div className="flex gap-2 text-[6px] text-gray-400">
                        <span>Work</span>
                        <span>About</span>
                        <span>Resume</span>
                        <span>Contact</span>
                      </div>
                    </div>

                    {/* Tag */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2">
                      <span className="text-[8px] text-yellow-500 border border-yellow-500/30 px-2 py-0.5 rounded-full">
                        AVAILABLE
                      </span>
                    </div>

                    {/* Hero text */}
                    <div className="text-center mt-4">
                      <h3 className="text-white text-sm font-light">
                        Pioneering the{" "}
                        <span className="text-blue-400">
                          future of humanity
                        </span>
                      </h3>
                      <button className="mt-2 text-[6px] text-white border border-white/30 px-2 py-0.5 rounded-full">
                        About me →
                      </button>
                    </div>

                    {/* Aurora effect mockup */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                      <div className="w-20 h-8 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 blur-sm rounded-full opacity-80"></div>
                      <div className="w-16 h-6 bg-gradient-to-r from-pink-500 via-red-500 to-orange-400 blur-sm rounded-full opacity-60 -mt-4 mx-auto"></div>
                    </div>

                    {/* Footer badge */}
                    <div className="absolute bottom-2 right-3">
                      <span className="text-[6px] text-gray-500 bg-gray-800 px-1 py-0.5 rounded">
                        Powered by IntelliFolio
                      </span>
                    </div>
                  </div>
                ) : (
                  // Professional Template Preview
                  <div className="w-full h-full bg-gray-900 flex relative overflow-hidden">
                    {/* Left side - Text */}
                    <div className="w-1/2 p-6 flex flex-col justify-center">
                      <h3 className="text-white text-2xl font-bold leading-tight">
                        Elon
                        <br />
                        Musk
                      </h3>
                      <p className="text-gray-400 text-[8px] mt-2">
                        Pioneering the future of humanity
                      </p>
                    </div>

                    {/* Right side - Image placeholder */}
                    <div className="w-1/2 relative">
                      <div className="absolute inset-0 bg-gradient-to-l from-gray-700 to-gray-800 flex items-center justify-center">
                        <div className="w-24 h-32 bg-gray-600 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Footer badge */}
                    <div className="absolute bottom-2 right-3">
                      <span className="text-[6px] text-gray-500 bg-gray-800 px-1 py-0.5 rounded">
                        Made with IntelliFolio
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-6 text-center bg-[#f5f0eb]">
                <h3 className="text-xl font-medium text-blue-600 mb-4">
                  {template.name}
                </h3>
                <button
                  onClick={() => handleSelectTemplate(template.id)}
                  className={`px-6 py-2.5 rounded-lg border-2 font-medium transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-900 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {selectedTemplate === template.id
                    ? "Selected"
                    : "Select Template"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        {selectedTemplate && (
          <div className="text-center mt-8">
            <button
              onClick={() => router.push("/dashboard/edit")}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue with{" "}
              {templates.find((t) => t.id === selectedTemplate)?.name} Template
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
