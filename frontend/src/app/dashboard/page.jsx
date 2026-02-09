"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [userName] = useState("Koyel Kalita");

  const navigationItems = [
    { name: "Go to Dashboard", href: "/dashboard", icon: "chart" },
    { name: "Edit Portfolio", href: "/dashboard/edit", icon: "edit" },
    { name: "Change Template", href: "/dashboard/templates", icon: "template" },
    { name: "Change Domain", href: "/dashboard/domain", icon: "settings" },
    { name: "Preview Portfolio", href: "/dashboard/preview", icon: "eye" },
  ];

  const stats = [
    {
      title: "Total Views",
      value: "0",
      subtitle: "Across all time",
      footer: "+0% today",
      footerIcon: "trend",
    },
    {
      title: "Views (Last 24h)",
      value: "0",
      subtitle: "Compared to last 7d: 0%",
      footer: "+0% efficiency",
      footerIcon: "check",
    },
    {
      title: "Device Types",
      value: "0",
      subtitle: "Desktop, Mobile, Tablet, etc.",
      footer: "Auto-detected from traffic",
      footerIcon: "info",
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case "chart":
        return (
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
      case "edit":
        return (
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        );
      case "template":
        return (
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
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
        );
      case "settings":
        return (
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        );
      case "eye":
        return (
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-[#f5f0eb] border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <Link href="/" className="text-2xl font-medium ">
            <span className="text-gray-800">&lt;Intelli</span>
            <span className="text-red-500">Folio</span>
            <span className="text-blue-500">-</span>
            <span className="text-gray-800">Her&gt;</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Navigation
          </p>
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-white/60 rounded-lg transition-colors"
                >
                  {getIcon(item.icon)}
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userName}
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your portfolio and account settings
            </p>
          </div>
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
        </div>

        {/* Summary Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/60 border border-gray-200 rounded-xl p-5"
              >
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400 mb-4">{stat.subtitle}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-gray-400">
                    {stat.footerIcon === "trend" && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    )}
                    {stat.footerIcon === "check" && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    {stat.footerIcon === "info" && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="text-sm text-gray-500">{stat.footer}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Analytics Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Detailed Analytics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Daily Views Chart */}
            <div className="lg:col-span-2 bg-white/60 border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-4">
                Daily Views (Past 7 Days)
              </h3>
              <div className="h-64 relative">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-gray-400">
                  <span>1.0</span>
                  <span>0.9</span>
                  <span>0.8</span>
                  <span>0.7</span>
                  <span>0.6</span>
                  <span>0.5</span>
                  <span>0.4</span>
                  <span>0.3</span>
                  <span>0.2</span>
                  <span>0.1</span>
                  <span>0</span>
                </div>
                {/* Grid */}
                <div className="absolute left-10 right-0 top-0 bottom-8 border-l border-b border-gray-200">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-full border-t border-gray-100"
                      style={{ top: `${i * 10}%` }}
                    />
                  ))}
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-full border-l border-gray-100"
                      style={{ left: `${(i + 1) * 14.28}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Views by Country & Top Cities */}
            <div className="bg-white/60 border border-gray-200 rounded-xl p-5">
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* Views by Country */}
                <div className="flex flex-col items-center justify-center text-center">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Views by Country
                  </h3>
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 mb-3">
                      <svg viewBox="0 0 64 64" className="w-full h-full">
                        <circle
                          cx="32"
                          cy="32"
                          r="30"
                          fill="#e0f2fe"
                          stroke="#38bdf8"
                          strokeWidth="2"
                        />
                        <ellipse
                          cx="32"
                          cy="32"
                          rx="12"
                          ry="30"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="1"
                        />
                        <line
                          x1="2"
                          y1="32"
                          x2="62"
                          y2="32"
                          stroke="#38bdf8"
                          strokeWidth="1"
                        />
                        <ellipse
                          cx="32"
                          cy="32"
                          rx="30"
                          ry="10"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="1"
                        />
                        <circle cx="20" cy="20" r="3" fill="#22c55e" />
                        <circle cx="44" cy="28" r="2" fill="#22c55e" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">No views yet</p>
                  </div>
                </div>

                {/* Top Cities */}
                <div className="flex flex-col items-center justify-center text-center">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Top Cities
                  </h3>
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 mb-3">
                      <svg viewBox="0 0 64 64" className="w-full h-full">
                        <rect
                          x="8"
                          y="30"
                          width="10"
                          height="26"
                          fill="#93c5fd"
                          rx="1"
                        />
                        <rect
                          x="22"
                          y="20"
                          width="10"
                          height="36"
                          fill="#60a5fa"
                          rx="1"
                        />
                        <rect
                          x="36"
                          y="10"
                          width="10"
                          height="46"
                          fill="#3b82f6"
                          rx="1"
                        />
                        <rect
                          x="50"
                          y="24"
                          width="8"
                          height="32"
                          fill="#93c5fd"
                          rx="1"
                        />
                        <rect
                          x="10"
                          y="32"
                          width="6"
                          height="4"
                          fill="#1e40af"
                        />
                        <rect
                          x="24"
                          y="24"
                          width="6"
                          height="4"
                          fill="#1e40af"
                        />
                        <rect
                          x="38"
                          y="14"
                          width="6"
                          height="4"
                          fill="#1e40af"
                        />
                        <line
                          x1="0"
                          y1="56"
                          x2="64"
                          y2="56"
                          stroke="#9ca3af"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">No views yet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
