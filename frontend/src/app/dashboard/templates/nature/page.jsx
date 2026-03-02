"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getPortfolios,
  getPortfolioProfile,
  getPortfolioSkills,
  getPortfolioProjects,
  getPortfolioSocialLinks,
  getPortfolioSections,
} from "@/lib/api";

/* ═══════════════════════════════════════════════
   Palette tokens (Tailwind utility classes)
   ─────────────────────────────────────────────
   Accent : amber-300 / amber-200 / yellow-300
   Glass  : white/10 backdrop-blur-xl border white/20
   Text   : white, white/80, white/60
   BG     : emerald-950 → stone-900 nature gradient
   ═══════════════════════════════════════════════ */

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
    google_scholar: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.838 3.94A8 8 0 0112 9a8 8 0 017.162 4.44L24 9.5z" />
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

/* ───────── Leaf SVG decoration ───────── */
const LeafDecor = ({ className = "" }) => (
  <svg className={`opacity-10 ${className}`} viewBox="0 0 120 180" fill="none">
    <path
      d="M60 0C60 0 120 60 120 120C120 150 93.137 180 60 180C26.863 180 0 150 0 120C0 60 60 0 60 0Z"
      fill="currentColor"
    />
    <path
      d="M60 20L60 160"
      stroke="currentColor"
      strokeWidth="1.5"
      opacity="0.5"
    />
    <path
      d="M60 60C75 50 90 60 95 80"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.3"
    />
    <path
      d="M60 90C45 80 30 90 25 110"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.3"
    />
    <path
      d="M60 120C75 110 85 120 88 135"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.3"
    />
  </svg>
);

/* ───────── Glass Card ───────── */
const GlassCard = ({ children, className = "", hover = true }) => (
  <div
    className={`bg-white/[0.07] backdrop-blur-xl border border-white/[0.12] rounded-2xl ${
      hover
        ? "hover:bg-white/[0.12] hover:border-amber-300/20 transition-all duration-500"
        : ""
    } ${className}`}
  >
    {children}
  </div>
);

/* ───────── Section Heading ───────── */
const SectionHeading = ({ label, title }) => (
  <div className="mb-12">
    <span className="text-amber-300/80 text-xs font-semibold tracking-[0.3em] uppercase block mb-3">
      {label}
    </span>
    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
      {title}
    </h2>
    <div className="mt-4 h-px w-16 bg-linear-to-r from-amber-300/60 to-transparent" />
  </div>
);

/* ═══════════════════════════════════════════════ */
/*                   MAIN PAGE                     */
/* ═══════════════════════════════════════════════ */
export default function NatureTemplatePage() {
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
  const [scrollY, setScrollY] = useState(0);

  /* parallax scroll listener */
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── data fetch ── */
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

  /* ── loading / error states ── */
  if (loading)
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-amber-300/40 border-t-amber-300 rounded-full animate-spin" />
          <p className="text-white/40 text-sm tracking-widest uppercase">
            Loading…
          </p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
        <GlassCard className="px-8 py-6" hover={false}>
          <p className="text-white/60 text-sm">{error}</p>
        </GlassCard>
      </div>
    );

  const name = profile?.name || "";
  const headline = profile?.merged_data?.headline || "";
  const summary = profile?.summary || "";
  const bio = profile?.merged_data?.bio || "";
  const email = profile?.email || "";
  const phone = profile?.phone || "";
  const location = profile?.location || "";
  const hasSkills =
    skills.technical.length || skills.soft.length || skills.language.length;

  return (
    <div className="min-h-screen bg-emerald-950 text-white overflow-x-hidden selection:bg-amber-300/30 selection:text-amber-100">
      {/* ══════════ Background layers ══════════ */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-emerald-950 via-stone-900 to-emerald-950" />
        {/* Radial warm glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[60vh] bg-[radial-gradient(ellipse_at_center,_rgba(251,191,36,0.06)_0%,_transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[80%] h-[40vh] bg-[radial-gradient(ellipse_at_bottom_right,_rgba(16,185,129,0.08)_0%,_transparent_70%)]" />
        {/* Leaf decorations */}
        <LeafDecor className="absolute -top-10 -right-10 w-60 h-90 text-emerald-400 rotate-12" />
        <LeafDecor className="absolute top-[60vh] -left-16 w-48 h-72 text-amber-400 -rotate-[25deg]" />
        <LeafDecor className="absolute bottom-20 right-10 w-36 h-54 text-emerald-300 rotate-[40deg]" />
      </div>

      {/* ══════════ Navbar (glass) ══════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 md:mx-8 mt-4">
          <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.1] rounded-2xl px-6 py-3 flex items-center justify-between">
            {/* Logo / name */}
            <a href="#" className="flex items-center gap-2 group">
              <span className="text-amber-300 text-lg">✦</span>
              <span className="text-sm font-semibold text-white/90 tracking-wide group-hover:text-amber-300 transition-colors">
                {name.split(" ")[0] || "Portfolio"}
              </span>
            </a>
            {/* Nav links */}
            <div className="hidden md:flex items-center gap-1">
              {[
                ...(summary || bio ? [{ label: "About", href: "#about" }] : []),
                ...(sections.experience?.length
                  ? [{ label: "Experience", href: "#experience" }]
                  : []),
                ...(projects.length
                  ? [{ label: "Projects", href: "#projects" }]
                  : []),
                ...(hasSkills ? [{ label: "Skills", href: "#skills" }] : []),
                { label: "Contact", href: "#contact" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-xs font-medium text-white/60 hover:text-amber-300 px-3 py-1.5 rounded-full hover:bg-white/[0.06] transition-all"
                >
                  {item.label}
                </a>
              ))}
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.slice(0, 3).map((l, i) => (
                <a
                  key={i}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-amber-300 transition-colors"
                >
                  <SocialIcon platform={l.platform} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════ Hero ══════════ */}
      <header className="relative min-h-screen flex items-center justify-center px-6 md:px-12">
        <div
          className="relative z-10 text-center max-w-3xl mx-auto"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        >
          {/* Greeting badge */}
          <div className="inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] rounded-full px-5 py-2 mb-8">
            <span className="text-amber-300 text-sm">🌿</span>
            <span className="text-xs font-medium text-white/70 tracking-wider uppercase">
              {headline || "Welcome to my portfolio"}
            </span>
          </div>
          {/* Name */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
            <span className="text-white">
              {name.split(" ").slice(0, -1).join(" ") || name}
            </span>
            {name.split(" ").length > 1 && (
              <>
                <br />
                <span className="bg-linear-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  {name.split(" ").slice(-1)[0]}
                </span>
              </>
            )}
          </h1>
          {/* Tagline */}
          {location && (
            <p className="text-white/50 text-sm tracking-widest uppercase mb-8">
              Based in {location}
            </p>
          )}
          {/* CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#projects"
              className="px-6 py-3 bg-linear-to-r from-amber-400 to-yellow-300 text-emerald-950 font-semibold text-sm rounded-full hover:shadow-lg hover:shadow-amber-400/20 transition-all hover:-translate-y-0.5"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-6 py-3 bg-white/[0.06] backdrop-blur-xl border border-white/[0.15] text-white/80 font-medium text-sm rounded-full hover:bg-white/[0.12] hover:border-amber-300/30 transition-all"
            >
              Get in Touch
            </a>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-linear-to-b from-white/30 to-transparent" />
        </div>
      </header>

      {/* ══════════ About ══════════ */}
      {(summary || bio) && (
        <section id="about" className="relative px-6 md:px-12 py-24 md:py-32">
          <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <SectionHeading label="About" title="Who I Am" />
              {/* Stats strip */}
              <div className="flex gap-6 mt-8">
                {projects.length > 0 && (
                  <div>
                    <p className="text-2xl font-bold text-amber-300">
                      {projects.length}
                    </p>
                    <p className="text-[10px] text-white/40 tracking-widest uppercase">
                      Projects
                    </p>
                  </div>
                )}
                {sections.experience?.length > 0 && (
                  <div>
                    <p className="text-2xl font-bold text-amber-300">
                      {sections.experience.length}
                    </p>
                    <p className="text-[10px] text-white/40 tracking-widest uppercase">
                      Roles
                    </p>
                  </div>
                )}
                {hasSkills > 0 && (
                  <div>
                    <p className="text-2xl font-bold text-amber-300">
                      {skills.technical.length +
                        skills.soft.length +
                        skills.language.length}
                    </p>
                    <p className="text-[10px] text-white/40 tracking-widest uppercase">
                      Skills
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-3">
              <GlassCard className="p-8 md:p-10">
                {summary && (
                  <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light">
                    {summary}
                  </p>
                )}
                {bio && bio !== summary && (
                  <p className="text-sm text-white/50 leading-relaxed mt-6 whitespace-pre-line">
                    {bio}
                  </p>
                )}
              </GlassCard>
            </div>
          </div>
        </section>
      )}

      {/* ══════════ Experience ══════════ */}
      {sections.experience?.length > 0 && (
        <section
          id="experience"
          className="relative px-6 md:px-12 py-24 md:py-32"
        >
          <div className="max-w-5xl mx-auto">
            <SectionHeading label="Experience" title="Where I've Worked" />
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-linear-to-b from-amber-300/30 via-emerald-400/20 to-transparent" />
              <div className="space-y-6">
                {sections.experience.map((exp, i) => (
                  <div key={i} className="relative pl-16 md:pl-20">
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-6 top-8 w-4 h-4 rounded-full border-2 border-amber-300/60 bg-emerald-950 z-10">
                      <div className="absolute inset-1 rounded-full bg-amber-300/40" />
                    </div>
                    <GlassCard className="p-6 md:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {exp.title}
                          </h3>
                          <p className="text-amber-300/80 text-sm font-medium">
                            {exp.company}
                            {exp.location && ` · ${exp.location}`}
                          </p>
                        </div>
                        <span className="text-xs text-white/40 bg-white/[0.06] rounded-full px-3 py-1 shrink-0 self-start">
                          {exp.startDate}
                          {exp.endDate && ` — ${exp.endDate}`}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-sm text-white/50 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                      {exp.enhanced_description &&
                        Array.isArray(exp.enhanced_description) &&
                        exp.enhanced_description.length > 0 && (
                          <ul className="mt-4 space-y-2">
                            {exp.enhanced_description.map((d, j) => (
                              <li
                                key={j}
                                className="text-sm text-white/50 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-amber-300/40"
                              >
                                {d}
                              </li>
                            ))}
                          </ul>
                        )}
                      {exp.achievements &&
                        Array.isArray(exp.achievements) &&
                        exp.achievements.length > 0 && (
                          <ul className="mt-4 space-y-2">
                            {exp.achievements.map((a, j) => (
                              <li
                                key={j}
                                className="text-sm text-white/50 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-emerald-400/40"
                              >
                                {a}
                              </li>
                            ))}
                          </ul>
                        )}
                    </GlassCard>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════ Education ══════════ */}
      {sections.education?.length > 0 && (
        <section className="relative px-6 md:px-12 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <SectionHeading label="Education" title="Academic Background" />
            <div className="grid md:grid-cols-2 gap-6">
              {sections.education.map((edu, i) => (
                <GlassCard key={i} className="p-8 relative overflow-hidden">
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.08)_0%,_transparent_70%)]" />
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-amber-300/70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {edu.degree}
                        {edu.field && ` in ${edu.field}`}
                      </h3>
                      <p className="text-amber-300/70 text-sm font-medium mt-1">
                        {edu.institution}
                      </p>
                      {(edu.startDate || edu.endDate) && (
                        <p className="text-xs text-white/40 mt-2">
                          {edu.startDate}
                          {edu.endDate && ` — ${edu.endDate}`}
                        </p>
                      )}
                      {edu.gpa && (
                        <p className="text-xs text-white/40 mt-1">
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════ Projects ══════════ */}
      {projects.length > 0 && (
        <section
          id="projects"
          className="relative px-6 md:px-12 py-24 md:py-32"
        >
          <div className="max-w-5xl mx-auto">
            <SectionHeading label="Projects" title="Selected Work" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p, i) => (
                <GlassCard key={i} className="p-0 overflow-hidden group">
                  {/* Top accent bar */}
                  <div className="h-1 bg-linear-to-r from-amber-300/60 via-yellow-200/40 to-emerald-400/30 group-hover:from-amber-300 group-hover:via-yellow-300 group-hover:to-emerald-400 transition-all duration-700" />
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        {p.github_url && (
                          <a
                            href={p.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/30 hover:text-amber-300 transition-colors"
                          >
                            <SocialIcon platform="github" />
                          </a>
                        )}
                        {p.url && (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/30 hover:text-amber-300 transition-colors"
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
                                strokeWidth={1.5}
                                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                              />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                    {p.description && (
                      <p className="text-sm text-white/45 leading-relaxed mb-4 line-clamp-3">
                        {p.description}
                      </p>
                    )}
                    {p.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {p.technologies.slice(0, 5).map((t, j) => (
                          <span
                            key={j}
                            className="text-[10px] font-medium text-amber-300/70 bg-amber-300/[0.08] border border-amber-300/[0.12] rounded-full px-2.5 py-0.5"
                          >
                            {t}
                          </span>
                        ))}
                        {p.technologies.length > 5 && (
                          <span className="text-[10px] font-medium text-white/30 bg-white/[0.04] rounded-full px-2.5 py-0.5">
                            +{p.technologies.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════ Skills ══════════ */}
      {hasSkills > 0 && (
        <section id="skills" className="relative px-6 md:px-12 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <SectionHeading label="Skills" title="Technologies & Tools" />
            <div className="grid md:grid-cols-3 gap-6">
              {skills.technical.length > 0 && (
                <GlassCard className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-amber-300/10 border border-amber-300/20 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-amber-300/80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-white/70 tracking-wider uppercase">
                      Technical
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.technical.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs text-white/60 bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1.5 hover:bg-amber-300/10 hover:border-amber-300/20 hover:text-amber-300 transition-all cursor-default"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              )}
              {skills.soft.length > 0 && (
                <GlassCard className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-emerald-400/80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-white/70 tracking-wider uppercase">
                      Interpersonal
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.soft.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs text-white/60 bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1.5 hover:bg-emerald-400/10 hover:border-emerald-400/20 hover:text-emerald-400 transition-all cursor-default"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              )}
              {skills.language.length > 0 && (
                <GlassCard className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-yellow-300/10 border border-yellow-300/20 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-yellow-300/80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-white/70 tracking-wider uppercase">
                      Languages
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.language.map((l, i) => (
                      <span
                        key={i}
                        className="text-xs text-white/60 bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1.5 hover:bg-yellow-300/10 hover:border-yellow-300/20 hover:text-yellow-300 transition-all cursor-default"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══════════ Publications ══════════ */}
      {sections.publications?.length > 0 && (
        <section className="relative px-6 md:px-12 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <SectionHeading label="Research" title="Publications" />
            <div className="space-y-4">
              {sections.publications.map((pub, i) => (
                <GlassCard key={i} className="p-6 md:p-8">
                  <h3 className="text-base font-bold text-white">
                    {typeof pub === "string" ? pub : pub.title}
                  </h3>
                  {pub.authors && (
                    <p className="text-sm text-white/40 mt-2">{pub.authors}</p>
                  )}
                  {(pub.journal || pub.year) && (
                    <p className="text-xs text-amber-300/60 mt-1 italic">
                      {pub.journal}
                      {pub.year && ` · ${pub.year}`}
                    </p>
                  )}
                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs text-amber-300/70 hover:text-amber-300 underline underline-offset-2 mt-2 transition-colors"
                    >
                      {pub.doi}
                    </a>
                  )}
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════ Awards ══════════ */}
      {sections.awards?.length > 0 && (
        <section className="relative px-6 md:px-12 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <SectionHeading label="Recognition" title="Awards & Honors" />
            <div className="grid md:grid-cols-2 gap-6">
              {sections.awards.map((a, i) => (
                <GlassCard key={i} className="p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-300/10 border border-amber-300/20 flex items-center justify-center shrink-0">
                    <span className="text-amber-300 text-sm">✦</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {typeof a === "string" ? a : a.title}
                    </h3>
                    {(a.organization || a.year) && (
                      <p className="text-xs text-white/40 mt-1">
                        {a.organization}
                        {a.year && ` · ${a.year}`}
                      </p>
                    )}
                    {a.description && (
                      <p className="text-sm text-white/50 mt-2">
                        {a.description}
                      </p>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════ Certifications ══════════ */}
      {sections.certifications?.length > 0 && (
        <section className="relative px-6 md:px-12 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <SectionHeading label="Credentials" title="Certifications" />
            <div className="flex flex-wrap gap-3">
              {sections.certifications.map((c, i) => (
                <GlassCard
                  key={i}
                  className="px-5 py-3 flex items-center gap-3"
                >
                  <svg
                    className="w-4 h-4 text-amber-300/60 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                  <span className="text-sm text-white/70 font-medium">
                    {typeof c === "string" ? c : c.name || c.title}
                    {c.issuer && (
                      <span className="text-white/30 ml-1.5">— {c.issuer}</span>
                    )}
                  </span>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════ Contact ══════════ */}
      <section id="contact" className="relative px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading label="Contact" title="Let's Connect" />
              <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                I&apos;m always open to new opportunities, collaborations, and
                interesting conversations. Feel free to reach out.
              </p>
            </div>
            <GlassCard className="p-8 md:p-10" hover={false}>
              <div className="space-y-5">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center shrink-0 group-hover:bg-amber-300/20 transition-colors">
                      <svg
                        className="w-4 h-4 text-amber-300/80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 tracking-wider uppercase">
                        Email
                      </p>
                      <p className="text-sm text-white/80 group-hover:text-amber-300 transition-colors">
                        {email}
                      </p>
                    </div>
                  </a>
                )}
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center shrink-0 group-hover:bg-amber-300/20 transition-colors">
                      <svg
                        className="w-4 h-4 text-amber-300/80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 tracking-wider uppercase">
                        Phone
                      </p>
                      <p className="text-sm text-white/80 group-hover:text-amber-300 transition-colors">
                        {phone}
                      </p>
                    </div>
                  </a>
                )}
                {location && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4 text-amber-300/80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 tracking-wider uppercase">
                        Location
                      </p>
                      <p className="text-sm text-white/80">{location}</p>
                    </div>
                  </div>
                )}
                {socialLinks.length > 0 && (
                  <div className="flex items-center gap-3 pt-4 border-t border-white/[0.08]">
                    {socialLinks.map((l, i) => (
                      <a
                        key={i}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-amber-300 hover:bg-amber-300/10 hover:border-amber-300/20 transition-all"
                        title={l.platform}
                      >
                        <SocialIcon platform={l.platform} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ══════════ Footer ══════════ */}
      <footer className="relative border-t border-white/[0.06] px-6 md:px-12 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-300/60 text-sm">✦</span>
            <p className="text-xs text-white/30 tracking-wider">
              © {new Date().getFullYear()} {name}. All rights reserved.
            </p>
          </div>
          <a
            href="#"
            className="text-xs text-white/30 hover:text-amber-300 tracking-wider transition-colors"
          >
            Back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
