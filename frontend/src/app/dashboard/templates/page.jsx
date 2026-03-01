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
    {
      id: "minimalist",
      name: "Minimalist",
      description: "Bold typographic design with generous whitespace",
      preview: "/templates/minimalist-preview.png",
      hasAnimatedBg: false,
    },
    {
      id: "nature",
      name: "Nature",
      description: "Nature-inspired glassmorphism with golden accents",
      preview: "/templates/nature-preview.png",
      hasAnimatedBg: true,
    },
    {
      id: "animated",
      name: "Animated",
      description: "Particle effects, scroll reveals & magnetic interactions",
      preview: "/templates/animated-preview.png",
      hasAnimatedBg: true,
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
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
              <div className="aspect-4/3 bg-gray-900 relative overflow-hidden">
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
                      <div className="w-20 h-8 bg-linear-to-r from-purple-500 via-blue-500 to-cyan-400 blur-sm rounded-full opacity-80"></div>
                      <div className="w-16 h-6 bg-linear-to-r from-pink-500 via-red-500 to-orange-400 blur-sm rounded-full opacity-60 -mt-4 mx-auto"></div>
                    </div>

                    {/* Footer badge */}
                    <div className="absolute bottom-2 right-3">
                      <span className="text-[6px] text-gray-500 bg-gray-800 px-1 py-0.5 rounded">
                        Powered by IntelliFolio
                      </span>
                    </div>
                  </div>
                ) : template.id === "professional" ? (
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
                      <div className="absolute inset-0 bg-linear-to-l from-gray-700 to-gray-800 flex items-center justify-center">
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
                ) : // Minimalist Template Preview
                template.id === "minimalist" ? (
                  <div className="w-full h-full bg-white flex flex-col justify-between p-6 relative">
                    {/* Top bar */}
                    <div className="flex justify-between items-center">
                      <span className="text-[7px] text-black font-semibold tracking-widest">
                        @PORTFOLIO
                      </span>
                      <div className="flex gap-1.5">
                        <span className="text-[5px] text-black font-semibold tracking-widest border border-black rounded-full px-1.5 py-0.5">
                          WORK
                        </span>
                        <span className="text-[5px] text-black font-semibold tracking-widest border border-black rounded-full px-1.5 py-0.5">
                          ABOUT
                        </span>
                        <span className="text-[5px] text-black font-semibold tracking-widest border border-black rounded-full px-1.5 py-0.5">
                          CONTACT
                        </span>
                      </div>
                    </div>

                    {/* Big bold name */}
                    <div className="flex-1 flex items-center">
                      <h3 className="text-black text-3xl font-black leading-none tracking-tighter uppercase">
                        JOHN
                        <br />
                        DOE
                      </h3>
                    </div>

                    {/* Bottom tagline + arrow */}
                    <div className="flex justify-between items-end">
                      <p className="text-[7px] text-black font-semibold tracking-widest uppercase">
                        DESIGNER &amp; DEVELOPER
                      </p>
                      <svg
                        className="w-3 h-3 text-black"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  </div>
                ) : template.id === "nature" ? (
                  // Nature Template Preview
                  <div className="w-full h-full bg-emerald-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                    {/* Radial glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.12)_0%,transparent_70%)]" />

                    {/* Leaf decoration */}
                    <svg
                      className="absolute -top-4 -right-4 w-20 h-28 text-emerald-400 opacity-10 rotate-12"
                      viewBox="0 0 120 180"
                      fill="currentColor"
                    >
                      <path d="M60 0C60 0 120 60 120 120C120 150 93 180 60 180C27 180 0 150 0 120C0 60 60 0 60 0Z" />
                    </svg>

                    {/* Glass navbar mockup */}
                    <div className="absolute top-3 left-3 right-3">
                      <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-300 text-[8px]">✦</span>
                          <span className="text-white/80 text-[7px] font-medium">
                            Portfolio
                          </span>
                        </div>
                        <div className="flex gap-1.5 text-[5px] text-white/40">
                          <span>About</span>
                          <span>Work</span>
                          <span>Contact</span>
                        </div>
                      </div>
                    </div>

                    {/* Hero content */}
                    <div className="text-center relative z-10">
                      <div className="inline-flex items-center gap-1 bg-white/10 border border-white/10 rounded-full px-2 py-0.5 mb-2">
                        <span className="text-[6px]">🌿</span>
                        <span className="text-[5px] text-white/60 tracking-wider uppercase">
                          Welcome
                        </span>
                      </div>
                      <h3 className="text-white text-lg font-bold leading-tight">
                        Jane
                      </h3>
                      <h3 className="text-amber-300 text-lg font-bold leading-tight">
                        Doe
                      </h3>
                    </div>

                    {/* CTA buttons mockup */}
                    <div className="flex gap-2 mt-3 relative z-10">
                      <span className="text-[5px] bg-amber-400 text-emerald-950 font-semibold px-2 py-0.5 rounded-full">
                        View Work
                      </span>
                      <span className="text-[5px] bg-white/10 border border-white/10 text-white/70 px-2 py-0.5 rounded-full">
                        Contact
                      </span>
                    </div>

                    {/* Bottom glass card mockup */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-white/6 backdrop-blur-sm border border-white/8 rounded-lg px-3 py-2">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <div className="w-3 h-3 rounded bg-amber-300/20 border border-amber-300/20" />
                            <div className="w-3 h-3 rounded bg-emerald-400/20 border border-emerald-400/20" />
                            <div className="w-3 h-3 rounded bg-yellow-300/20 border border-yellow-300/20" />
                          </div>
                          <span className="text-[5px] text-white/30 tracking-wider">
                            SKILLS
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Animated Template Preview
                  <div className="w-full h-full bg-neutral-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                    {/* Particle dots */}
                    {[...Array(18)].map((_, j) => (
                      <div
                        key={j}
                        className="absolute w-1 h-1 rounded-full bg-violet-400/40"
                        style={{
                          top: `${10 + Math.random() * 80}%`,
                          left: `${5 + Math.random() * 90}%`,
                          animationDelay: `${Math.random() * 3}s`,
                        }}
                      />
                    ))}

                    {/* Floating nav dots */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                    </div>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-0.5 mb-2">
                      <span className="w-1 h-1 rounded-full bg-green-400" />
                      <span className="text-[5px] text-white/50 tracking-wider uppercase">
                        Available
                      </span>
                    </div>

                    {/* Name with gradient */}
                    <h3 className="text-white text-lg font-black tracking-tighter leading-none">
                      John
                    </h3>
                    <h3 className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 via-fuchsia-400 to-pink-400 text-lg font-black tracking-tighter leading-none">
                      Doe
                    </h3>

                    {/* CTA buttons */}
                    <div className="flex gap-1.5 mt-3">
                      <span className="text-[5px] bg-violet-600 text-white font-semibold px-2 py-0.5 rounded-full">
                        View Projects
                      </span>
                      <span className="text-[5px] bg-transparent border border-white/15 text-white/70 px-2 py-0.5 rounded-full">
                        Contact
                      </span>
                    </div>

                    {/* Bottom bar mockup */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-full" />
                      </div>
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
