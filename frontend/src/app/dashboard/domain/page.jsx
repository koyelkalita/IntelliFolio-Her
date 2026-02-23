"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard";

export default function DomainPage() {
  const router = useRouter();
  const [subdomain, setSubdomain] = useState("");

  const handleContinue = () => {
    if (subdomain.trim()) {
      // Save subdomain and navigate to preview
      console.log(`Subdomain selected: ${subdomain}`);
      router.push("/dashboard/preview");
    }
  };

  return (
    <DashboardLayout
      fixedSidebar={true}
      showMenuButton={true}
      showHeader={true}
      headerBackLink="/dashboard/templates"
      headerBackText="Change Template"
    >
      {/* Domain Selection Content */}
      <div className="p-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Choose Your
            <br />
            Subdomain
          </h1>
          <p className="text-gray-600 text-lg">
            Your portfolio will be available at{" "}
            <span className="text-blue-600">
              yourapp.vercel.app/portfolio/username
            </span>
          </p>
        </div>

        {/* Subdomain Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-8">
            {/* Subdomain Label */}
            <label className="block text-white text-lg font-medium mb-4">
              Subdomain
            </label>

            {/* Subdomain Input */}
            <div className="flex items-center bg-white rounded-lg overflow-hidden mb-6">
              <span className="px-4 py-4 text-gray-500 bg-gray-50 border-r border-gray-200">
                IntelliFolio.Her/
              </span>
              <input
                type="text"
                value={subdomain}
                onChange={(e) =>
                  setSubdomain(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                  )
                }
                placeholder="yourname"
                className="flex-1 px-4 py-4 text-gray-900 focus:outline-none"
              />
            </div>

            {/* Preview Box */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-gray-400 text-sm mb-1">
                Your portfolio will be available at:
              </p>
              <p className="text-blue-400 font-mono">
                yourapp.vercel.app/portfolio/username
                {subdomain || "yourname"}
              </p>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!subdomain.trim()}
              className={`w-full py-4 rounded-lg font-medium transition-colors ${
                subdomain.trim()
                  ? "bg-white text-gray-900 hover:bg-gray-100"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue to Preview
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
