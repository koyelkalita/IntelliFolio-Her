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

/* ───────── Social Icons ───────── */
const SocialIcon = ({ platform }) => {
  const map = {
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
  return map[platform] || map.website;
};

/* ───────── Section wrapper ───────── */
const Section = ({ id, title, children, className = "" }) => (
  <section id={id} className={`py-20 ${className}`}>
    <div className="max-w-5xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-white mb-10">{title}</h2>
      {children}
    </div>
  </section>
);

/* ───────── Divider ───────── */
const Divider = () => (
  <div className="max-w-5xl mx-auto px-6">
    <div className="border-t border-white/10" />
  </div>
);

/* ───────── Main Page ───────── */
export default function ContemporaryTemplatePage() {
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

  /* ── Fetch portfolio data ── */
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

        // Support ?portfolio=slug, otherwise find the best portfolio with data
        const params = new URLSearchParams(window.location.search);
        const slug = params.get("portfolio");
        let portfolio;
        if (slug) {
          portfolio = res.portfolios.find((p) => p.slug === slug);
        }

        // Sort by created_at descending (newest first)
        const sorted = [...res.portfolios].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );

        // Try each portfolio until we find one with a profile
        let prof = null,
          sk = [],
          proj = [],
          links = [],
          secs = [];
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

        // Fetch remaining data
        const [skData, projData, linksData, secsData] = await Promise.all([
          getPortfolioSkills(pId),
          getPortfolioProjects(pId),
          getPortfolioSocialLinks(pId),
          getPortfolioSections(pId),
        ]);
        sk = skData;
        proj = projData;
        links = linksData;
        secs = secsData;

        setProfile(prof);
        setProjects(proj || []);
        setSocialLinks(links || []);

        // categorise skills
        const technical = [],
          soft = [],
          language = [];
        for (const s of sk || []) {
          if (s.category === "technical") technical.push(s.skill_name);
          else if (s.category === "soft") soft.push(s.skill_name);
          else if (s.category === "language") language.push(s.skill_name);
        }
        setSkills({ technical, soft, language });

        // normalise sections
        const map = {};
        for (const sec of secs || []) {
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

  /* ── Loading / Error states ── */
  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );

  /* ── Derived data ── */
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
    <div className="min-h-screen bg-linear-to-b from-gray-950 via-black to-gray-950 text-white">
      {/* ── Sticky nav ── */}
      <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center text-xs font-bold">
              {initials}
            </span>
            <span className="font-medium text-sm">{name}</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            {sections.experience?.length > 0 && (
              <a
                href="#experience"
                className="hover:text-white transition-colors"
              >
                Experience
              </a>
            )}
            {sections.education?.length > 0 && (
              <a
                href="#education"
                className="hover:text-white transition-colors"
              >
                Education
              </a>
            )}
            {projects.length > 0 && (
              <a
                href="#projects"
                className="hover:text-white transition-colors"
              >
                Projects
              </a>
            )}
            {hasSkills > 0 && (
              <a href="#skills" className="hover:text-white transition-colors">
                Skills
              </a>
            )}
          </div>
          {email && (
            <a
              href={`mailto:${email}`}
              className="text-sm px-4 py-1.5 rounded-md bg-white text-black font-medium hover:bg-gray-200 transition-colors"
            >
              Contact
            </a>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="pt-32 pb-24 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            {name}
          </h1>
          {headline && (
            <p className="text-xl md:text-2xl text-gray-400 mb-6">{headline}</p>
          )}
          {summary && (
            <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              {summary}
            </p>
          )}

          {/* Contact row */}
          <div className="flex flex-wrap justify-center gap-5 text-sm text-gray-400 mb-8">
            {location && (
              <span className="flex items-center gap-1.5">
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
                className="flex items-center gap-1.5 hover:text-white transition-colors"
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
                {email}
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
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
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <SocialIcon platform="github" />
                {githubUsername}
              </a>
            )}
          </div>

          {/* Social links */}
          {socialLinks.length > 0 && (
            <div className="flex justify-center gap-3">
              {socialLinks.map((l, i) => (
                <a
                  key={i}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={l.platform}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
                >
                  <SocialIcon platform={l.platform} />
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      <Divider />

      {/* ── About / Bio ── */}
      {bio && (
        <>
          <Section id="about" title="About Me">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
              {bio}
            </p>
          </Section>
          <Divider />
        </>
      )}

      {/* ── Work Experience ── */}
      {sections.experience?.length > 0 && (
        <>
          <Section id="experience" title="Work Experience">
            <div className="space-y-8">
              {sections.experience.map((exp, i) => (
                <div key={i} className="border-l-2 border-blue-500 pl-6">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                    <h3 className="text-xl font-semibold">{exp.title}</h3>
                    {(exp.startDate || exp.endDate) && (
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {exp.startDate}
                        {exp.endDate && ` – ${exp.endDate}`}
                      </span>
                    )}
                  </div>
                  <p className="text-blue-400 font-medium mb-2">
                    {exp.company}
                    {exp.location && ` · ${exp.location}`}
                  </p>
                  {exp.description && (
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                  {exp.enhanced_description &&
                    Array.isArray(exp.enhanced_description) &&
                    exp.enhanced_description.length > 0 && (
                      <ul className="mt-2 list-disc list-inside text-gray-400 text-sm space-y-1">
                        {exp.enhanced_description.map((d, j) => (
                          <li key={j}>{d}</li>
                        ))}
                      </ul>
                    )}
                  {exp.achievements &&
                    Array.isArray(exp.achievements) &&
                    exp.achievements.length > 0 && (
                      <ul className="mt-2 list-disc list-inside text-gray-400 text-sm space-y-1">
                        {exp.achievements.map((a, j) => (
                          <li key={j}>{a}</li>
                        ))}
                      </ul>
                    )}
                </div>
              ))}
            </div>
          </Section>
          <Divider />
        </>
      )}

      {/* ── Education ── */}
      {sections.education?.length > 0 && (
        <>
          <Section id="education" title="Education">
            <div className="space-y-8">
              {sections.education.map((edu, i) => (
                <div key={i} className="border-l-2 border-purple-500 pl-6">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                    <h3 className="text-xl font-semibold">
                      {edu.degree}
                      {edu.field && ` in ${edu.field}`}
                    </h3>
                    {(edu.startDate || edu.endDate) && (
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {edu.startDate}
                        {edu.endDate && ` – ${edu.endDate}`}
                      </span>
                    )}
                  </div>
                  <p className="text-purple-400 font-medium mb-1">
                    {edu.institution}
                    {edu.location && ` · ${edu.location}`}
                  </p>
                  {edu.gpa && (
                    <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                  )}
                  {edu.achievements &&
                    Array.isArray(edu.achievements) &&
                    edu.achievements.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {edu.achievements.map((a, j) => (
                          <span
                            key={j}
                            className="text-xs px-3 py-1 rounded-full bg-purple-900/30 text-purple-300"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </Section>
          <Divider />
        </>
      )}

      {/* ── Projects ── */}
      {projects.length > 0 && (
        <>
          <Section id="projects" title="Projects">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((p, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold mb-2">{p.name}</h3>
                  {p.description && (
                    <p className="text-gray-400 text-sm mb-4">
                      {p.description}
                    </p>
                  )}
                  {p.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.technologies.map((t, j) => (
                        <span
                          key={j}
                          className="text-xs px-2.5 py-1 rounded-full bg-blue-900/30 text-blue-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {(p.url || p.github_url) && (
                    <div className="flex gap-4 text-sm">
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          Live Demo →
                        </a>
                      )}
                      {p.github_url && (
                        <a
                          href={p.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          GitHub →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
          <Divider />
        </>
      )}

      {/* ── Skills ── */}
      {hasSkills > 0 && (
        <>
          <Section id="skills" title="Skills">
            {skills.technical.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Technical
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.technical.map((s, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-blue-500/50 transition-colors"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skills.soft.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Soft Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.soft.map((s, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-green-500/50 transition-colors"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skills.language.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.language.map((l, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-purple-500/50 transition-colors"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Section>
          <Divider />
        </>
      )}

      {/* ── Publications ── */}
      {sections.publications?.length > 0 && (
        <>
          <Section id="publications" title="Publications">
            <div className="space-y-6">
              {sections.publications.map((pub, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-1">
                    {typeof pub === "string" ? pub : pub.title}
                  </h3>
                  {pub.authors && (
                    <p className="text-sm text-gray-400">{pub.authors}</p>
                  )}
                  {(pub.journal || pub.year) && (
                    <p className="text-sm text-gray-500 mt-1">
                      {pub.journal}
                      {pub.year && ` · ${pub.year}`}
                    </p>
                  )}
                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 text-sm hover:underline mt-1 inline-block"
                    >
                      DOI: {pub.doi}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Section>
          <Divider />
        </>
      )}

      {/* ── Awards ── */}
      {sections.awards?.length > 0 && (
        <>
          <Section id="awards" title="Awards & Honors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.awards.map((a, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4"
                >
                  <span className="w-9 h-9 shrink-0 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400">
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
                  </span>
                  <div>
                    <h3 className="font-semibold">
                      {typeof a === "string" ? a : a.title}
                    </h3>
                    {(a.organization || a.year) && (
                      <p className="text-sm text-gray-500">
                        {a.organization}
                        {a.year && ` · ${a.year}`}
                      </p>
                    )}
                    {a.description && (
                      <p className="text-sm text-gray-400 mt-1">
                        {a.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
          <Divider />
        </>
      )}

      {/* ── Certifications ── */}
      {sections.certifications?.length > 0 && (
        <>
          <Section id="certifications" title="Certifications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.certifications.map((c, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4"
                >
                  <span className="w-9 h-9 shrink-0 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
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
                  </span>
                  <div>
                    <h3 className="font-semibold">
                      {typeof c === "string" ? c : c.name || c.title}
                    </h3>
                    {c.issuer && (
                      <p className="text-sm text-gray-500">{c.issuer}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
          <Divider />
        </>
      )}

      {/* ── Footer ── */}
      <footer className="py-16 text-center text-gray-500 text-sm">
        <p>
          © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-4 mt-4">
            {socialLinks.map((l, i) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                title={l.platform}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <SocialIcon platform={l.platform} />
              </a>
            ))}
          </div>
        )}
      </footer>
    </div>
  );
}
