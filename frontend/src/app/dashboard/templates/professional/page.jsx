"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getPortfolios,
  getPortfolioProfile,
  getPortfolioSkills,
  getPortfolioProjects,
  getPortfolioSocialLinks,
  getPortfolioSections,
} from "@/lib/api";

/* ───────── Social Icon ───────── */
const SocialIcon = ({ platform }) => {
  const icons = {
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.948-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
        <path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    dribbble: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.81z" />
      </svg>
    ),
    google_scholar: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 100 14 7 7 0 000-14z" />
      </svg>
    ),
    calendly: (
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
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    website: (
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
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
  };
  return icons[platform] || icons.website;
};

/* ───────── Badge ───────── */
const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-md border ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

/* ───────── Main Page ───────── */
export default function ProfessionalTemplatePage() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState({
    technical: [],
    soft: [],
    language: [],
  });
  const [projects, setProjects] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [sections, setSections] = useState({});

  useEffect(() => {
    async function load() {
      try {
        if (!currentUser) {
          setError("Please sign in to preview your portfolio.");
          return;
        }
        const token = await currentUser.getIdToken();
        const res = await getPortfolios(token);
        if (res.status !== "success" || !res.portfolios?.length) {
          setError("No portfolio found. Build your profile first.");
          return;
        }

        const params = new URLSearchParams(window.location.search);
        const slug = params.get("portfolio");
        let portfolio;
        if (slug) {
          portfolio = res.portfolios.find((p) => p.slug === slug);
        }

        const sorted = [...res.portfolios].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );

        let prof = null;
        const candidates = portfolio ? [portfolio] : sorted;
        for (const candidate of candidates) {
          const testProfile = await getPortfolioProfile(candidate.id);
          if (testProfile) {
            portfolio = candidate;
            prof = testProfile;
            break;
          }
        }

        if (!portfolio || !prof) {
          setError("No portfolio with data found. Build your profile first.");
          return;
        }
        const pId = portfolio.id;

        const [skData, projData, linksData, secsData] = await Promise.all([
          getPortfolioSkills(pId),
          getPortfolioProjects(pId),
          getPortfolioSocialLinks(pId),
          getPortfolioSections(pId),
        ]);

        setProfile(prof);
        setProjects(projData || []);
        setSocialLinks(linksData || []);

        const technical = [],
          soft = [],
          language = [];
        for (const s of skData || []) {
          if (s.category === "technical") technical.push(s.skill_name);
          else if (s.category === "soft") soft.push(s.skill_name);
          else if (s.category === "language") language.push(s.skill_name);
        }
        setSkills({ technical, soft, language });

        const map = {};
        for (const sec of secsData || []) {
          const arr = Array.isArray(sec.content) ? sec.content : [];
          if (sec.section_type === "experience") {
            map.experience = arr.map((e) => {
              let start = e.startDate || "",
                end = e.endDate || "";
              if (!start && e.duration) {
                const p = e.duration.split(/\s*[-–]\s*/);
                start = p[0]?.trim() || "";
                end = p[1]?.trim() || "";
              }
              return {
                ...e,
                title: e.title || "",
                company: e.company || e.organization || "",
                location: e.location || "",
                startDate: start,
                endDate: end,
                description: Array.isArray(e.description)
                  ? e.description.join(" ")
                  : e.description || "",
              };
            });
          } else if (sec.section_type === "education") {
            map.education = arr.map((e) => ({
              ...e,
              degree: e.degree || "",
              field: e.field || "",
              institution: e.institution || e.school || "",
              location: e.location || "",
              startDate: e.startDate || "",
              endDate: e.endDate || "",
              gpa: e.gpa || "",
            }));
          } else {
            map[sec.section_type] = arr;
          }
        }
        setSections(map);
      } catch (err) {
        console.error(err);
        setError("Failed to load portfolio data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  /* ── Loading / Error ── */
  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading portfolio...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );

  /* ── Derived ── */
  const name = profile?.name || "Portfolio";
  const headline = profile?.merged_data?.headline || "";
  const summary = profile?.summary || "";
  const bio = profile?.merged_data?.bio || "";
  const email = profile?.email || "";
  const phone = profile?.phone || "";
  const location = profile?.location || "";
  const githubUsername = profile?.github_username || "";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const hasSkills =
    skills.technical.length || skills.soft.length || skills.language.length;

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-stone-50 text-gray-900 font-sans antialiased">
      {/* ── Topbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">{name}</p>
              {headline && (
                <p className="text-xs text-gray-500 mt-0.5">{headline}</p>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            {(summary || bio) && (
              <a
                href="#about"
                className="hover:text-teal-600 transition-colors"
              >
                About
              </a>
            )}
            {sections.experience?.length > 0 && (
              <a
                href="#experience"
                className="hover:text-teal-600 transition-colors"
              >
                Experience
              </a>
            )}
            {sections.education?.length > 0 && (
              <a
                href="#education"
                className="hover:text-teal-600 transition-colors"
              >
                Education
              </a>
            )}
            {projects.length > 0 && (
              <a
                href="#projects"
                className="hover:text-teal-600 transition-colors"
              >
                Projects
              </a>
            )}
            {hasSkills > 0 && (
              <a
                href="#skills"
                className="hover:text-teal-600 transition-colors"
              >
                Skills
              </a>
            )}
          </div>
          {email && (
            <a
              href={`mailto:${email}`}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
            >
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Hire Me
            </a>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            {/* Left – text */}
            <div className="md:col-span-3">
              <p className="text-teal-600 font-semibold text-sm tracking-wide uppercase mb-3">
                Portfolio
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4">
                {name}
              </h1>
              {headline && (
                <p className="text-xl text-gray-500 mb-6">{headline}</p>
              )}
              {summary && (
                <p className="text-gray-600 leading-relaxed max-w-xl mb-8">
                  {summary}
                </p>
              )}

              {/* Contact pills */}
              <div className="flex flex-wrap gap-3 mb-6">
                {location && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1.5">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {location}
                  </span>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1.5 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {email}
                  </a>
                )}
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1.5 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {phone}
                  </a>
                )}
                {githubUsername && (
                  <a
                    href={`https://github.com/${githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1.5 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    <SocialIcon platform="github" />
                    {githubUsername}
                  </a>
                )}
              </div>

              {/* Social */}
              {socialLinks.length > 0 && (
                <div className="flex gap-2">
                  {socialLinks.map((l, i) => (
                    <a
                      key={i}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={l.platform}
                      className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                    >
                      <SocialIcon platform={l.platform} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Right – stats card */}
            <div className="md:col-span-2">
              <div className="bg-stone-50 rounded-2xl border border-gray-200 p-8 space-y-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  At a Glance
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {sections.experience?.length > 0 && (
                    <div>
                      <p className="text-3xl font-bold text-teal-600">
                        {sections.experience.length}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Roles</p>
                    </div>
                  )}
                  {projects.length > 0 && (
                    <div>
                      <p className="text-3xl font-bold text-teal-600">
                        {projects.length}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Projects</p>
                    </div>
                  )}
                  {skills.technical.length > 0 && (
                    <div>
                      <p className="text-3xl font-bold text-teal-600">
                        {skills.technical.length}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Technologies
                      </p>
                    </div>
                  )}
                  {sections.education?.length > 0 && (
                    <div>
                      <p className="text-3xl font-bold text-teal-600">
                        {sections.education.length}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {sections.education.length === 1 ? "Degree" : "Degrees"}
                      </p>
                    </div>
                  )}
                </div>
                {(sections.awards?.length > 0 ||
                  sections.certifications?.length > 0) && (
                  <div className="border-t border-gray-200 pt-4 flex gap-4">
                    {sections.awards?.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 text-amber-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                          />
                        </svg>
                        {sections.awards.length} Award
                        {sections.awards.length > 1 && "s"}
                      </div>
                    )}
                    {sections.certifications?.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 text-green-500"
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
                        {sections.certifications.length} Cert
                        {sections.certifications.length > 1 && "s"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── About ── */}
      {bio && (
        <section id="about" className="py-20 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-2">About Me</h2>
                <div className="w-12 h-1 bg-teal-500 rounded-full" />
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                  {bio}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Experience ── */}
      {sections.experience?.length > 0 && (
        <section id="experience" className="py-20 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-2">Work Experience</h2>
              <div className="w-12 h-1 bg-teal-500 rounded-full" />
            </div>
            <div className="space-y-0">
              {sections.experience.map((exp, i) => (
                <div key={i} className="relative pl-8 pb-12 last:pb-0 group">
                  {/* Timeline line */}
                  {i < sections.experience.length - 1 && (
                    <div className="absolute left-2.75 top-3 bottom-0 w-px bg-gray-200" />
                  )}
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1.5 w-5.75 h-5.75 rounded-full border-3 border-teal-500 bg-white z-10" />

                  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-lg font-bold">{exp.title}</h3>
                        <p className="text-teal-600 font-medium">
                          {exp.company}
                          {exp.location && (
                            <span className="text-gray-400">
                              {" "}
                              · {exp.location}
                            </span>
                          )}
                        </p>
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <span className="text-xs font-medium text-gray-400 bg-gray-50 rounded-full px-3 py-1 whitespace-nowrap self-start">
                          {exp.startDate}
                          {exp.endDate && ` — ${exp.endDate}`}
                        </span>
                      )}
                    </div>
                    {exp.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                    {exp.enhanced_description &&
                      Array.isArray(exp.enhanced_description) &&
                      exp.enhanced_description.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {exp.enhanced_description.map((d, j) => (
                            <li
                              key={j}
                              className="text-sm text-gray-600 flex items-start gap-2"
                            >
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      )}
                    {exp.achievements &&
                      Array.isArray(exp.achievements) &&
                      exp.achievements.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {exp.achievements.map((a, j) => (
                            <li
                              key={j}
                              className="text-sm text-gray-600 flex items-start gap-2"
                            >
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Education ── */}
      {sections.education?.length > 0 && (
        <section
          id="education"
          className="py-20 bg-white border-b border-gray-100"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-2">Education</h2>
              <div className="w-12 h-1 bg-violet-500 rounded-full" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {sections.education.map((edu, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 p-6 bg-stone-50 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 shrink-0">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l9-5-9-5-9 5 9 5z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900">
                        {edu.degree}
                        {edu.field && ` in ${edu.field}`}
                      </h3>
                      <p className="text-violet-600 font-medium text-sm">
                        {edu.institution}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {edu.location && (
                          <Badge variant="default">{edu.location}</Badge>
                        )}
                        {(edu.startDate || edu.endDate) && (
                          <Badge variant="violet">
                            {edu.startDate}
                            {edu.endDate && ` – ${edu.endDate}`}
                          </Badge>
                        )}
                        {edu.gpa && (
                          <Badge variant="emerald">GPA: {edu.gpa}</Badge>
                        )}
                      </div>
                      {edu.achievements &&
                        Array.isArray(edu.achievements) &&
                        edu.achievements.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {edu.achievements.map((a, j) => (
                              <Badge key={j} variant="amber">
                                {a}
                              </Badge>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Projects ── */}
      {projects.length > 0 && (
        <section id="projects" className="py-20 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-2">Projects</h2>
              <div className="w-12 h-1 bg-teal-500 rounded-full" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5 group flex flex-col"
                >
                  {/* Color top bar */}
                  <div className="h-1.5 bg-teal-500" />
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                      {p.name}
                    </h3>
                    {p.description && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-1">
                        {p.description}
                      </p>
                    )}
                    {p.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.technologies.map((t, j) => (
                          <Badge key={j} variant="teal">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {(p.url || p.github_url) && (
                      <div className="flex gap-3 mt-auto pt-3 border-t border-gray-100">
                        {p.url && (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-teal-600 font-medium hover:underline flex items-center gap-1"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            Live
                          </a>
                        )}
                        {p.github_url && (
                          <a
                            href={p.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-500 font-medium hover:text-gray-700 flex items-center gap-1"
                          >
                            <SocialIcon platform="github" />
                            Code
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Skills ── */}
      {hasSkills > 0 && (
        <section
          id="skills"
          className="py-20 bg-white border-b border-gray-100"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-2">Skills & Expertise</h2>
              <div className="w-12 h-1 bg-teal-500 rounded-full" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {skills.technical.length > 0 && (
                <div className="rounded-xl border border-gray-200 p-6 bg-stone-50">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">
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
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">
                      Technical
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.technical.map((s, i) => (
                      <Badge key={i} variant="teal">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {skills.soft.length > 0 && (
                <div className="rounded-xl border border-gray-200 p-6 bg-stone-50">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">
                      Soft Skills
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.soft.map((s, i) => (
                      <Badge key={i} variant="emerald">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {skills.language.length > 0 && (
                <div className="rounded-xl border border-gray-200 p-6 bg-stone-50">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
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
                          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">
                      Languages
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.language.map((l, i) => (
                      <Badge key={i} variant="violet">
                        {l}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Publications ── */}
      {sections.publications?.length > 0 && (
        <section id="publications" className="py-20 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-2">Publications</h2>
              <div className="w-12 h-1 bg-teal-500 rounded-full" />
            </div>
            <div className="space-y-4">
              {sections.publications.map((pub, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
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
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {typeof pub === "string" ? pub : pub.title}
                      </h3>
                      {pub.authors && (
                        <p className="text-sm text-gray-500 mt-1">
                          {pub.authors}
                        </p>
                      )}
                      {(pub.journal || pub.year) && (
                        <p className="text-sm text-gray-400 mt-0.5">
                          {pub.journal}
                          {pub.year && ` · ${pub.year}`}
                        </p>
                      )}
                      {pub.doi && (
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-teal-600 hover:underline mt-1 inline-block"
                        >
                          DOI: {pub.doi}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Awards ── */}
      {sections.awards?.length > 0 && (
        <section
          id="awards"
          className="py-20 bg-white border-b border-gray-100"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-2">Awards & Honors</h2>
              <div className="w-12 h-1 bg-amber-400 rounded-full" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {sections.awards.map((a, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 p-6 bg-stone-50 flex items-start gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
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
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {typeof a === "string" ? a : a.title}
                    </h3>
                    {(a.organization || a.year) && (
                      <p className="text-sm text-gray-500 mt-0.5">
                        {a.organization}
                        {a.year && ` · ${a.year}`}
                      </p>
                    )}
                    {a.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {a.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Certifications ── */}
      {sections.certifications?.length > 0 && (
        <section id="certifications" className="py-20 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-2">Certifications</h2>
              <div className="w-12 h-1 bg-green-500 rounded-full" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.certifications.map((c, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-500 shrink-0">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {typeof c === "string" ? c : c.name || c.title}
                    </h3>
                    {c.issuer && (
                      <p className="text-xs text-gray-500 truncate">
                        {c.issuer}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {socialLinks.length > 0 && (
            <div className="flex justify-center gap-3 mb-6">
              {socialLinks.map((l, i) => (
                <a
                  key={i}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={l.platform}
                  className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                >
                  <SocialIcon platform={l.platform} />
                </a>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
