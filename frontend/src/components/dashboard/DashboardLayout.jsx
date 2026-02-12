"use client";

import DashboardSidebar from "./DashboardSidebar";
import Logo from "./Logo";
import Link from "next/link";

export default function DashboardLayout({
  children,
  fixedSidebar = false,
  showMenuButton = false,
  showHeader = false,
  headerBackLink = null,
  headerBackText = null,
}) {
  return (
    <div className="min-h-screen bg-[#f5f0eb] flex">
      {/* Sidebar */}
      <DashboardSidebar fixed={fixedSidebar} showMenuButton={showMenuButton} />

      {/* Main Content */}
      <main className={`flex-1 ${fixedSidebar ? "ml-72" : ""}`}>
        {/* Optional Header */}
        {showHeader && (
          <header className="bg-[#f5f0eb] border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
              {headerBackLink && (
                <Link
                  href={headerBackLink}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  <span className="text-sm font-medium">{headerBackText}</span>
                </Link>
              )}
            </div>

            <div className="flex items-center">
              <Logo />
            </div>

            <SignOutButton />
          </header>
        )}

        {children}
      </main>
    </div>
  );
}

export function SignOutButton() {
  return (
    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white/60 transition-colors">
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span className="text-sm font-medium">Sign Out</span>
    </button>
  );
}
