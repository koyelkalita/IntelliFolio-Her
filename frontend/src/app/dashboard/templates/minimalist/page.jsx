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
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    twitter: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    instagram: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.948-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    website: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
  };
  return icons[platform] || icons.website;
};

/* ───────── Arrow Icon ───────── */
const ArrowDown = () => (
  <svg
    className="w-6 h-6"
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
);

/* ───────── Main Page ───────── */
export default function MinimalistTemplatePage() {
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
          setError("Please sign in.");
          return;
        }
        const token = await currentUser.getIdToken();
        const res = await getPortfolios(token);
        if (res.status !== "success" || !res.portfolios?.length) {
          setError("No portfolio found.");
          return;
        }

        const params = new URLSearchParams(window.location.search);
        const slug = params.get("portfolio");
        let portfolio;
        if (slug) portfolio = res.portfolios.find((p) => p.slug === slug);

        const sorted = [...res.portfolios].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
        let prof = null;
        for (const c of portfolio ? [portfolio] : sorted) {
          const tp = await getPortfolioProfile(c.id);
          if (tp) {
            portfolio = c;
            prof = tp;
            break;
          }
        }
        if (!prof) {
          setError("No portfolio data found.");
          return;
        }
        const pId = portfolio.id;

        const [sk, pr, ln, sc] = await Promise.all([
          getPortfolioSkills(pId),
          getPortfolioProjects(pId),
          getPortfolioSocialLinks(pId),
          getPortfolioSections(pId),
        ]);

        setProfile(prof);
        setProjects(pr || []);
        setSocialLinks(ln || []);

        const technical = [],
          soft = [],
          language = [];
        for (const s of sk || []) {
          if (s.category === "technical") technical.push(s.skill_name);
          else if (s.category === "soft") soft.push(s.skill_name);
          else if (s.category === "language") language.push(s.skill_name);
        }
        setSkills({ technical, soft, language });

        const map = {};
        for (const sec of sc || []) {
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
        setError("Failed to load portfolio.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-neutral-500">{error}</p>
      </div>
    );

  const name = profile?.name || "";
  const headline = profile?.merged_data?.headline || "";
  const summary = profile?.summary || "";
  const bio = profile?.merged_data?.bio || "";
  const email = profile?.email || "";
  const phone = profile?.phone || "";
  const location = profile?.location || "";
  const githubUsername = profile?.github_username || "";
  const hasSkills =
    skills.technical.length || skills.soft.length || skills.language.length;

  /* Build nav items dynamically */
  const navItems = [];
  if (sections.experience?.length)
    navItems.push({ label: "WORK", href: "#work" });
  if (projects.length) navItems.push({ label: "PROJECTS", href: "#projects" });
  if (summary || bio) navItems.push({ label: "ABOUT", href: "#about" });
  if (email) navItems.push({ label: "CONTACT", href: "#contact" });

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* ── Top bar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="flex items-center justify-between px-8 md:px-12 h-14 border-b border-neutral-100">
          <span className="text-xs font-semibold tracking-widest uppercase">
            @
            {githubUsername || name.split(" ")[0]?.toLowerCase() || "portfolio"}
          </span>
          <div className="hidden md:flex items-center gap-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[11px] font-semibold tracking-widest uppercase px-4 py-1.5 border border-black rounded-full hover:bg-black hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
          {/* Social icons – mobile nav fallback */}
          <div className="flex md:hidden items-center gap-3">
            {socialLinks.slice(0, 3).map((l, i) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black"
              >
                <SocialIcon platform={l.platform} />
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="min-h-screen flex flex-col justify-between px-8 md:px-12 pt-14">
        <div className="flex-1 flex items-center">
          <div className="w-full grid md:grid-cols-2 gap-8 items-end py-20">
            {/* Name – massive bold */}
            <h1 className="text-[clamp(3rem,10vw,9rem)] font-black leading-[0.9] tracking-tighter uppercase">
              {name}
            </h1>
            {/* Tagline + arrow */}
            <div className="flex flex-col items-start md:items-end gap-6 pb-4">
              {headline && (
                <p className="text-sm font-semibold tracking-widest uppercase max-w-xs text-right leading-snug">
                  {location && `${location} BASED `}
                  {headline}.
                </p>
              )}
              <a
                href="#work"
                className="hover:translate-y-1 transition-transform"
              >
                <ArrowDown />
              </a>
            </div>
          </div>
        </div>
        {/* Bottom social strip */}
        {socialLinks.length > 0 && (
          <div className="flex items-center gap-6 pb-8 border-t border-neutral-100 pt-6">
            {socialLinks.map((l, i) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-neutral-400 hover:text-black transition-colors"
              >
                <SocialIcon platform={l.platform} />
                <span className="text-[10px] font-semibold tracking-widest uppercase hidden sm:inline">
                  {l.platform.replace("_", " ")}
                </span>
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ── About ── */}
      {(summary || bio) && (
        <section id="about" className="border-t border-black">
          <div className="grid md:grid-cols-4 min-h-[50vh]">
            <div className="md:col-span-1 px-8 md:px-12 py-12 flex items-start">
              <h2 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400">
                About
              </h2>
            </div>
            <div className="md:col-span-3 px-8 md:px-12 py-12 md:border-l border-black flex items-center">
              <div className="max-w-2xl space-y-6">
                {summary && (
                  <p className="text-2xl md:text-3xl font-light leading-relaxed">
                    {summary}
                  </p>
                )}
                {bio && bio !== summary && (
                  <p className="text-base text-neutral-500 leading-relaxed whitespace-pre-line">
                    {bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Experience ── */}
      {sections.experience?.length > 0 && (
        <section id="work" className="border-t border-black">
          <div className="px-8 md:px-12 py-8">
            <h2 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-12">
              Experience
            </h2>
          </div>
          {sections.experience.map((exp, i) => (
            <div
              key={i}
              className="border-t border-neutral-200 group hover:bg-neutral-50 transition-colors"
            >
              <div className="grid md:grid-cols-4 px-8 md:px-12 py-8">
                <div className="md:col-span-1 mb-4 md:mb-0">
                  <p className="text-xs text-neutral-400 font-medium tabular-nums">
                    {exp.startDate}
                    {exp.endDate && ` — ${exp.endDate}`}
                  </p>
                </div>
                <div className="md:col-span-3">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
                    <h3 className="text-lg font-bold tracking-tight">
                      {exp.title}
                    </h3>
                    <span className="text-sm text-neutral-500">
                      {exp.company}
                      {exp.location && `, ${exp.location}`}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-neutral-500 leading-relaxed max-w-xl">
                      {exp.description}
                    </p>
                  )}
                  {exp.enhanced_description &&
                    Array.isArray(exp.enhanced_description) &&
                    exp.enhanced_description.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {exp.enhanced_description.map((d, j) => (
                          <li
                            key={j}
                            className="text-sm text-neutral-500 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-black before:rounded-full"
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}
                  {exp.achievements &&
                    Array.isArray(exp.achievements) &&
                    exp.achievements.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {exp.achievements.map((a, j) => (
                          <li
                            key={j}
                            className="text-sm text-neutral-500 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-black before:rounded-full"
                          >
                            {a}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ── Education ── */}
      {sections.education?.length > 0 && (
        <section className="border-t border-black">
          <div className="px-8 md:px-12 py-8">
            <h2 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-12">
              Education
            </h2>
          </div>
          {sections.education.map((edu, i) => (
            <div
              key={i}
              className="border-t border-neutral-200 group hover:bg-neutral-50 transition-colors"
            >
              <div className="grid md:grid-cols-4 px-8 md:px-12 py-8">
                <div className="md:col-span-1 mb-4 md:mb-0">
                  <p className="text-xs text-neutral-400 font-medium tabular-nums">
                    {edu.startDate}
                    {edu.endDate && ` — ${edu.endDate}`}
                  </p>
                </div>
                <div className="md:col-span-3">
                  <h3 className="text-lg font-bold tracking-tight">
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                  </p>
                  {edu.gpa && (
                    <p className="text-xs text-neutral-400 mt-2">
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ── Projects ── */}
      {projects.length > 0 && (
        <section id="projects" className="border-t border-black">
          <div className="px-8 md:px-12 py-8">
            <h2 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-12">
              Selected Projects
            </h2>
          </div>
          {projects.map((p, i) => (
            <div
              key={i}
              className="border-t border-neutral-200 group hover:bg-neutral-50 transition-colors"
            >
              <div className="grid md:grid-cols-4 px-8 md:px-12 py-8">
                <div className="md:col-span-1 mb-4 md:mb-0">
                  <p className="text-xs text-neutral-400 font-medium">
                    {p.technologies?.slice(0, 3).join(" / ")}
                  </p>
                </div>
                <div className="md:col-span-3">
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <h3 className="text-lg font-bold tracking-tight group-hover:underline underline-offset-4">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-3 shrink-0">
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 hover:text-black transition-colors"
                        >
                          Live ↗
                        </a>
                      )}
                      {p.github_url && (
                        <a
                          href={p.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 hover:text-black transition-colors"
                        >
                          Code ↗
                        </a>
                      )}
                    </div>
                  </div>
                  {p.description && (
                    <p className="text-sm text-neutral-500 leading-relaxed max-w-xl">
                      {p.description}
                    </p>
                  )}
                  {p.technologies?.length > 3 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {p.technologies.slice(3).map((t, j) => (
                        <span
                          key={j}
                          className="text-[10px] font-medium tracking-wider uppercase text-neutral-400 border border-neutral-200 rounded-full px-2.5 py-0.5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ── Skills ── */}
      {hasSkills > 0 && (
        <section className="border-t border-black">
          <div className="grid md:grid-cols-4 px-8 md:px-12 py-16">
            <div className="md:col-span-1 mb-8 md:mb-0">
              <h2 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400">
                Skills
              </h2>
            </div>
            <div className="md:col-span-3 space-y-10">
              {skills.technical.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold tracking-widest uppercase text-neutral-300 mb-4">
                    Technical
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.technical.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium tracking-wide border border-black rounded-full px-3 py-1.5 hover:bg-black hover:text-white transition-colors cursor-default"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.soft.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold tracking-widest uppercase text-neutral-300 mb-4">
                    Soft Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.soft.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium tracking-wide border border-neutral-300 rounded-full px-3 py-1.5 text-neutral-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.language.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold tracking-widest uppercase text-neutral-300 mb-4">
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.language.map((l, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium tracking-wide border border-neutral-300 rounded-full px-3 py-1.5 text-neutral-600"
                      >
                        {l}
                      </span>
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
        <section className="border-t border-black">
          <div className="px-8 md:px-12 py-8">
            <h2 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-12">
              Publications
            </h2>
          </div>
          {sections.publications.map((pub, i) => (
            <div
              key={i}
              className="border-t border-neutral-200 px-8 md:px-12 py-6"
            >
              <h3 className="text-base font-bold tracking-tight">
                {typeof pub === "string" ? pub : pub.title}
              </h3>
              {pub.authors && (
                <p className="text-sm text-neutral-400 mt-1">{pub.authors}</p>
              )}
              {(pub.journal || pub.year) && (
                <p className="text-xs text-neutral-400 mt-1">
                  {pub.journal}
                  {pub.year && ` · ${pub.year}`}
                </p>
              )}
              {pub.doi && (
                <a
                  href={`https://doi.org/${pub.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-black underline underline-offset-2 mt-1 inline-block"
                >
                  {pub.doi}
                </a>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ── Awards ── */}
      {sections.awards?.length > 0 && (
        <section className="border-t border-black">
          <div className="grid md:grid-cols-4 px-8 md:px-12 py-16">
            <div className="md:col-span-1 mb-8 md:mb-0">
              <h2 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400">
                Awards
              </h2>
            </div>
            <div className="md:col-span-3 space-y-6">
              {sections.awards.map((a, i) => (
                <div key={i}>
                  <h3 className="text-base font-bold tracking-tight">
                    {typeof a === "string" ? a : a.title}
                  </h3>
                  {(a.organization || a.year) && (
                    <p className="text-sm text-neutral-400 mt-0.5">
                      {a.organization}
                      {a.year && ` · ${a.year}`}
                    </p>
                  )}
                  {a.description && (
                    <p className="text-sm text-neutral-500 mt-1">
                      {a.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Certifications ── */}
      {sections.certifications?.length > 0 && (
        <section className="border-t border-black">
          <div className="grid md:grid-cols-4 px-8 md:px-12 py-16">
            <div className="md:col-span-1 mb-8 md:mb-0">
              <h2 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400">
                Certifications
              </h2>
            </div>
            <div className="md:col-span-3">
              <div className="flex flex-wrap gap-3">
                {sections.certifications.map((c, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium tracking-wide border border-black rounded-full px-4 py-2"
                  >
                    {typeof c === "string" ? c : c.name || c.title}
                    {c.issuer && (
                      <span className="text-neutral-400 ml-1">
                        — {c.issuer}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Contact ── */}
      <section id="contact" className="border-t border-black">
        <div className="px-8 md:px-12 py-24 md:py-32">
          <h2 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-12">
            Get in Touch
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-3xl md:text-5xl font-black tracking-tighter leading-tight uppercase">
                Let&apos;s work
                <br />
                together.
              </p>
            </div>
            <div className="flex flex-col justify-end gap-4">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="text-lg font-medium underline underline-offset-4 decoration-neutral-300 hover:decoration-black transition-colors"
                >
                  {email}
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="text-lg font-medium underline underline-offset-4 decoration-neutral-300 hover:decoration-black transition-colors"
                >
                  {phone}
                </a>
              )}
              {location && (
                <p className="text-sm text-neutral-400 uppercase tracking-widest">
                  {location}
                </p>
              )}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-4 mt-4">
                  {socialLinks.map((l, i) => (
                    <a
                      key={i}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-black transition-colors"
                      title={l.platform}
                    >
                      <SocialIcon platform={l.platform} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-200 px-8 md:px-12 py-6 flex items-center justify-between">
        <p className="text-[10px] text-neutral-400 tracking-widest uppercase">
          © {new Date().getFullYear()} {name}
        </p>
        <a
          href="#"
          className="text-[10px] text-neutral-400 tracking-widest uppercase hover:text-black transition-colors"
        >
          Back to top ↑
        </a>
      </footer>
    </div>
  );
}
