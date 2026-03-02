"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  getPortfolios,
  getPortfolioProfile,
  getPortfolioSkills,
  getPortfolioProjects,
  getPortfolioSocialLinks,
  getPortfolioSections,
} from "@/lib/api";
import { Particles } from "@/components/ui/particles";
import { GradualSpacing } from "@/components/ui/gradual-spacing";

/* ═══════════════════════════════════════════
   21st.dev-style animated components
   ═══════════════════════════════════════════ */

/* ─── Animated counter ─── */
const AnimatedCounter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const num = parseInt(value) || 0;
    if (num === 0) return;
    let start = 0;
    const step = Math.max(1, Math.floor(num / (duration * 60)));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) {
        setCount(num);
        clearInterval(timer);
      } else setCount(start);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return <span ref={ref}>{count}</span>;
};

/* ─── Reveal on scroll ─── */
const RevealOnScroll = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const dirs = {
    up: { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -60 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={dirs[direction] || dirs.up}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── Stagger container ─── */
const StaggerContainer = ({ children, className = "", staggerDelay = 0.1 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerItem = ({ children, className = "" }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ─── Magnetic hover button ─── */
const MagneticButton = ({ children, className = "", href, ...props }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - left - width / 2) * 0.3,
      y: (e.clientY - top - height / 2) * 0.3,
    });
  };
  const reset = () => setPos({ x: 0, y: 0 });

  const Tag = href ? motion.a : motion.button;
  return (
    <Tag
      ref={ref}
      href={href}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={className}
      {...props}
    >
      {children}
    </Tag>
  );
};

/* ─── Animated skill bar ─── */
const SkillBar = ({ name, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const width = 50 + Math.random() * 50; // visual representation

  return (
    <div ref={ref} className="group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-white/70 group-hover:text-violet-300 transition-colors">
          {name}
        </span>
      </div>
      <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${width}%` } : {}}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500"
        />
      </div>
    </div>
  );
};

/* ─── Social Icon ─── */
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
          strokeWidth={1.5}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
  };
  return icons[platform] || icons.website;
};

/* ─── Floating nav dot indicator ─── */
const FloatingNav = ({ sections: navSections }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;
      for (let i = navSections.length - 1; i >= 0; i--) {
        const el = document.getElementById(navSections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActive(i);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [navSections]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-3"
    >
      {navSections.map((sec, i) => (
        <a
          key={sec.id}
          href={`#${sec.id}`}
          className="group flex items-center gap-3"
          title={sec.label}
        >
          <span
            className={`text-[10px] font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity ${i === active ? "text-violet-400" : "text-white/50"}`}
          >
            {sec.label}
          </span>
          <motion.div
            animate={{
              scale: i === active ? 1 : 0.6,
              backgroundColor:
                i === active ? "rgb(167 139 250)" : "rgba(255,255,255,0.2)",
            }}
            className="w-2.5 h-2.5 rounded-full"
          />
        </a>
      ))}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
                  MAIN PAGE
   ═══════════════════════════════════════════ */
export default function AnimatedTemplatePage() {
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
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.9]);

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

  /* ── Loading ── */
  if (loading)
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full"
        />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/50 text-sm"
        >
          {error}
        </motion.p>
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

  /* Dynamic nav sections */
  const navSections = [
    { id: "hero", label: "Home" },
    ...(summary || bio ? [{ id: "about", label: "About" }] : []),
    ...(sections.experience?.length
      ? [{ id: "experience", label: "Experience" }]
      : []),
    ...(projects.length ? [{ id: "projects", label: "Projects" }] : []),
    ...(hasSkills ? [{ id: "skills", label: "Skills" }] : []),
    { id: "contact", label: "Contact" },
  ];

  const nameWords = name.split(" ");

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden selection:bg-violet-500/30">
      {/* Particles background */}
      <div className="fixed inset-0 z-0">
        <Particles
          className="w-full h-full"
          quantity={80}
          color="#a78bfa"
          size={0.5}
          staticity={40}
          ease={60}
        />
      </div>

      {/* Floating nav */}
      <FloatingNav sections={navSections} />

      {/* ═══ Navbar ═══ */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="flex items-center justify-between px-8 md:px-12 h-16">
          <motion.a
            href="#hero"
            whileHover={{ scale: 1.05 }}
            className="text-sm font-bold bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"
          >
            {nameWords[0] || "Portfolio"}
          </motion.a>
          <div className="hidden md:flex items-center gap-8">
            {navSections.slice(1).map((item) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                whileHover={{ y: -2 }}
                className="text-xs font-medium text-white/50 hover:text-white transition-colors tracking-wider uppercase"
              >
                {item.label}
              </motion.a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.slice(0, 3).map((l, i) => (
              <motion.a
                key={i}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, color: "#a78bfa" }}
                className="text-white/40 transition-colors"
              >
                <SocialIcon platform={l.platform} />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ═══ Hero ═══ */}
      <motion.header
        id="hero"
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 z-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/8 rounded-full px-5 py-2 text-xs text-white/60 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {headline || "Available for opportunities"}
          </span>
        </motion.div>

        {/* GradualSpacing name */}
        <div className="mb-4">
          <GradualSpacing
            text={nameWords[0] || name}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white"
            duration={0.6}
            delayMultiple={0.06}
          />
        </div>
        {nameWords.length > 1 && (
          <div className="mb-8">
            <GradualSpacing
              text={nameWords.slice(1).join(" ")}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter bg-linear-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent"
              duration={0.6}
              delayMultiple={0.06}
            />
          </div>
        )}

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-center text-white/40 text-sm md:text-base max-w-md tracking-wide"
        >
          {location && `${location} · `}
          {headline || "Building digital experiences"}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="flex flex-wrap items-center gap-4 mt-10"
        >
          <MagneticButton
            href="#projects"
            className="group relative px-7 py-3 overflow-hidden rounded-full bg-violet-600 text-sm font-semibold text-white"
          >
            <span className="relative z-10">View Projects</span>
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-fuchsia-500 to-violet-600"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
          </MagneticButton>
          <MagneticButton
            href="#contact"
            className="px-7 py-3 rounded-full border border-white/15 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all"
          >
            Contact Me
          </MagneticButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-white/20"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase">
              Scroll
            </span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </motion.div>
      </motion.header>

      {/* ═══ About ═══ */}
      {(summary || bio) && (
        <section
          id="about"
          className="relative px-6 md:px-12 py-28 md:py-36 z-10"
        >
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            {/* Left – stats */}
            <RevealOnScroll direction="left">
              <div className="space-y-8">
                <div>
                  <span className="text-xs font-semibold tracking-[0.3em] uppercase text-violet-400">
                    About Me
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight">
                    Crafting{" "}
                    <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                      digital
                    </span>{" "}
                    experiences
                  </h2>
                </div>
                {/* Animated stats */}
                <div className="grid grid-cols-3 gap-6">
                  {projects.length > 0 && (
                    <div className="text-center">
                      <p className="text-3xl font-black text-violet-400">
                        <AnimatedCounter value={projects.length} />+
                      </p>
                      <p className="text-[10px] text-white/40 tracking-widest uppercase mt-1">
                        Projects
                      </p>
                    </div>
                  )}
                  {sections.experience?.length > 0 && (
                    <div className="text-center">
                      <p className="text-3xl font-black text-fuchsia-400">
                        <AnimatedCounter value={sections.experience.length} />
                      </p>
                      <p className="text-[10px] text-white/40 tracking-widest uppercase mt-1">
                        Roles
                      </p>
                    </div>
                  )}
                  {hasSkills > 0 && (
                    <div className="text-center">
                      <p className="text-3xl font-black text-pink-400">
                        <AnimatedCounter
                          value={
                            skills.technical.length +
                            skills.soft.length +
                            skills.language.length
                          }
                        />
                      </p>
                      <p className="text-[10px] text-white/40 tracking-widest uppercase mt-1">
                        Skills
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </RevealOnScroll>
            {/* Right – text */}
            <RevealOnScroll direction="right" delay={0.2}>
              <div className="bg-white/3 backdrop-blur-xl border border-white/6 rounded-3xl p-8 md:p-10">
                {summary && (
                  <p className="text-lg text-white/70 leading-relaxed font-light">
                    {summary}
                  </p>
                )}
                {bio && bio !== summary && (
                  <p className="text-sm text-white/40 leading-relaxed mt-5 whitespace-pre-line">
                    {bio}
                  </p>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </section>
      )}

      {/* ═══ Experience ═══ */}
      {sections.experience?.length > 0 && (
        <section
          id="experience"
          className="relative px-6 md:px-12 py-28 md:py-36 z-10"
        >
          <div className="max-w-5xl mx-auto">
            <RevealOnScroll>
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-violet-400">
                Career
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-16 tracking-tight">
                Work{" "}
                <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Experience
                </span>
              </h2>
            </RevealOnScroll>

            <StaggerContainer staggerDelay={0.15} className="space-y-6">
              {sections.experience.map((exp, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    whileHover={{
                      x: 8,
                      backgroundColor: "rgba(255,255,255,0.04)",
                    }}
                    transition={{ duration: 0.3 }}
                    className="relative bg-white/2 backdrop-blur-xl border border-white/6 rounded-2xl p-6 md:p-8 group"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-violet-300 transition-colors">
                          {exp.title}
                        </h3>
                        <p className="text-violet-400/70 text-sm font-medium mt-1">
                          {exp.company}
                          {exp.location && ` · ${exp.location}`}
                        </p>
                      </div>
                      <span className="text-xs text-white/30 bg-white/4 rounded-full px-4 py-1.5 shrink-0 self-start tabular-nums">
                        {exp.startDate}
                        {exp.endDate && ` — ${exp.endDate}`}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-white/40 leading-relaxed">
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
                              className="text-sm text-white/40 pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-violet-400/50"
                            >
                              {d}
                            </li>
                          ))}
                        </ul>
                      )}
                    {exp.achievements?.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {exp.achievements.map((a, j) => (
                          <li
                            key={j}
                            className="text-sm text-white/40 pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-fuchsia-400/50"
                          >
                            {a}
                          </li>
                        ))}
                      </ul>
                    )}
                    {/* Hover glow */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[radial-gradient(600px_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(139,92,246,0.04),transparent_60%)]" />
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ═══ Education ═══ */}
      {sections.education?.length > 0 && (
        <section className="relative px-6 md:px-12 py-28 md:py-36 z-10">
          <div className="max-w-5xl mx-auto">
            <RevealOnScroll>
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-violet-400">
                Education
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-16 tracking-tight">
                Academic{" "}
                <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Background
                </span>
              </h2>
            </RevealOnScroll>

            <StaggerContainer
              className="grid md:grid-cols-2 gap-6"
              staggerDelay={0.15}
            >
              {sections.education.map((edu, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white/3 backdrop-blur-xl border border-white/6 rounded-2xl p-8 h-full group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-6 h-6 text-violet-400"
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
                    <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                      {edu.degree}
                      {edu.field && ` in ${edu.field}`}
                    </h3>
                    <p className="text-violet-400/60 text-sm mt-1">
                      {edu.institution}
                    </p>
                    {(edu.startDate || edu.endDate) && (
                      <p className="text-xs text-white/30 mt-3">
                        {edu.startDate}
                        {edu.endDate && ` — ${edu.endDate}`}
                      </p>
                    )}
                    {edu.gpa && (
                      <p className="text-xs text-white/30 mt-1">
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ═══ Projects ═══ */}
      {projects.length > 0 && (
        <section
          id="projects"
          className="relative px-6 md:px-12 py-28 md:py-36 z-10"
        >
          <div className="max-w-6xl mx-auto">
            <RevealOnScroll>
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-violet-400">
                Portfolio
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-16 tracking-tight">
                Featured{" "}
                <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Projects
                </span>
              </h2>
            </RevealOnScroll>

            <StaggerContainer
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              staggerDelay={0.1}
            >
              {projects.map((p, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-white/3 backdrop-blur-xl border border-white/6 rounded-2xl overflow-hidden group h-full flex flex-col"
                  >
                    {/* Animated top bar */}
                    <div className="h-1 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-500"
                        initial={{ x: "-100%" }}
                        whileInView={{ x: "0%" }}
                        transition={{
                          duration: 1,
                          delay: i * 0.1,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        viewport={{ once: true }}
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                          {p.name}
                        </h3>
                        <div className="flex items-center gap-2 shrink-0">
                          {p.github_url && (
                            <motion.a
                              whileHover={{ scale: 1.2, rotate: 5 }}
                              href={p.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/30 hover:text-violet-400 transition-colors"
                            >
                              <SocialIcon platform="github" />
                            </motion.a>
                          )}
                          {p.url && (
                            <motion.a
                              whileHover={{ scale: 1.2, rotate: -5 }}
                              href={p.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/30 hover:text-violet-400 transition-colors"
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
                                  strokeWidth={1.5}
                                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                />
                              </svg>
                            </motion.a>
                          )}
                        </div>
                      </div>
                      {p.description && (
                        <p className="text-sm text-white/35 leading-relaxed mb-4 line-clamp-3 flex-1">
                          {p.description}
                        </p>
                      )}
                      {p.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          {p.technologies.slice(0, 5).map((t, j) => (
                            <motion.span
                              key={j}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + j * 0.05 }}
                              viewport={{ once: true }}
                              className="text-[10px] font-medium text-violet-300/60 bg-violet-500/8 border border-violet-500/12 rounded-full px-2.5 py-0.5"
                            >
                              {t}
                            </motion.span>
                          ))}
                          {p.technologies.length > 5 && (
                            <span className="text-[10px] text-white/20 bg-white/3 rounded-full px-2.5 py-0.5">
                              +{p.technologies.length - 5}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ═══ Skills ═══ */}
      {hasSkills > 0 && (
        <section
          id="skills"
          className="relative px-6 md:px-12 py-28 md:py-36 z-10"
        >
          <div className="max-w-5xl mx-auto">
            <RevealOnScroll>
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-violet-400">
                Expertise
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-16 tracking-tight">
                Skills &{" "}
                <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Technologies
                </span>
              </h2>
            </RevealOnScroll>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Technical – animated bars */}
              {skills.technical.length > 0 && (
                <RevealOnScroll direction="up" delay={0}>
                  <div className="bg-white/3 backdrop-blur-xl border border-white/6 rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-violet-400"
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
                    <div className="space-y-3">
                      {skills.technical.slice(0, 12).map((s, i) => (
                        <SkillBar key={i} name={s} delay={i * 0.05} />
                      ))}
                      {skills.technical.length > 12 && (
                        <p className="text-xs text-white/20 mt-3">
                          +{skills.technical.length - 12} more
                        </p>
                      )}
                    </div>
                  </div>
                </RevealOnScroll>
              )}
              {/* Soft skills – animated pills */}
              {skills.soft.length > 0 && (
                <RevealOnScroll direction="up" delay={0.1}>
                  <div className="bg-white/3 backdrop-blur-xl border border-white/6 rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-fuchsia-500/20 to-pink-500/20 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-fuchsia-400"
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
                    <StaggerContainer
                      className="flex flex-wrap gap-2"
                      staggerDelay={0.05}
                    >
                      {skills.soft.map((s, i) => (
                        <StaggerItem key={i}>
                          <motion.span
                            whileHover={{
                              scale: 1.1,
                              backgroundColor: "rgba(232,121,249,0.15)",
                            }}
                            className="text-xs text-white/50 bg-white/4 border border-white/8 rounded-full px-3 py-1.5 cursor-default inline-block"
                          >
                            {s}
                          </motion.span>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  </div>
                </RevealOnScroll>
              )}
              {/* Languages */}
              {skills.language.length > 0 && (
                <RevealOnScroll direction="up" delay={0.2}>
                  <div className="bg-white/3 backdrop-blur-xl border border-white/6 rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-pink-400"
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
                    <StaggerContainer
                      className="flex flex-wrap gap-2"
                      staggerDelay={0.08}
                    >
                      {skills.language.map((l, i) => (
                        <StaggerItem key={i}>
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className="text-xs text-white/50 bg-white/4 border border-white/8 rounded-full px-3 py-1.5 cursor-default inline-block"
                          >
                            {l}
                          </motion.span>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  </div>
                </RevealOnScroll>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Publications ═══ */}
      {sections.publications?.length > 0 && (
        <section className="relative px-6 md:px-12 py-28 md:py-36 z-10">
          <div className="max-w-5xl mx-auto">
            <RevealOnScroll>
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-violet-400">
                Research
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-16 tracking-tight">
                Publications
              </h2>
            </RevealOnScroll>
            <StaggerContainer className="space-y-4" staggerDelay={0.1}>
              {sections.publications.map((pub, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    whileHover={{ x: 6 }}
                    className="bg-white/2 border border-white/6 rounded-2xl p-6 md:p-8 transition-colors hover:bg-white/4"
                  >
                    <h3 className="text-base font-bold text-white">
                      {typeof pub === "string" ? pub : pub.title}
                    </h3>
                    {pub.authors && (
                      <p className="text-sm text-white/30 mt-2">
                        {pub.authors}
                      </p>
                    )}
                    {(pub.journal || pub.year) && (
                      <p className="text-xs text-violet-400/50 mt-1 italic">
                        {pub.journal}
                        {pub.year && ` · ${pub.year}`}
                      </p>
                    )}
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-violet-400/60 hover:text-violet-400 underline underline-offset-2 mt-2 inline-block transition-colors"
                      >
                        {pub.doi}
                      </a>
                    )}
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ═══ Awards ═══ */}
      {sections.awards?.length > 0 && (
        <section className="relative px-6 md:px-12 py-28 md:py-36 z-10">
          <div className="max-w-5xl mx-auto">
            <RevealOnScroll>
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-violet-400">
                Recognition
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-16 tracking-tight">
                Awards
              </h2>
            </RevealOnScroll>
            <StaggerContainer
              className="grid md:grid-cols-2 gap-6"
              staggerDelay={0.12}
            >
              {sections.awards.map((a, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white/3 border border-white/6 rounded-2xl p-6 flex items-start gap-4 group"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-10 h-10 rounded-full bg-linear-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center shrink-0"
                    >
                      <span className="text-violet-400">✦</span>
                    </motion.div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                        {typeof a === "string" ? a : a.title}
                      </h3>
                      {(a.organization || a.year) && (
                        <p className="text-xs text-white/30 mt-1">
                          {a.organization}
                          {a.year && ` · ${a.year}`}
                        </p>
                      )}
                      {a.description && (
                        <p className="text-sm text-white/40 mt-2">
                          {a.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ═══ Certifications ═══ */}
      {sections.certifications?.length > 0 && (
        <section className="relative px-6 md:px-12 py-28 md:py-36 z-10">
          <div className="max-w-5xl mx-auto">
            <RevealOnScroll>
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-violet-400">
                Credentials
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-16 tracking-tight">
                Certifications
              </h2>
            </RevealOnScroll>
            <StaggerContainer
              className="flex flex-wrap gap-3"
              staggerDelay={0.06}
            >
              {sections.certifications.map((c, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/3 border border-white/6 rounded-full px-5 py-2.5 flex items-center gap-2.5 group"
                  >
                    <svg
                      className="w-4 h-4 text-violet-400/60 shrink-0 group-hover:text-violet-400 transition-colors"
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
                    <span className="text-sm text-white/60 font-medium group-hover:text-white/80 transition-colors">
                      {typeof c === "string" ? c : c.name || c.title}
                      {c.issuer && (
                        <span className="text-white/25 ml-1.5">
                          — {c.issuer}
                        </span>
                      )}
                    </span>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ═══ Contact ═══ */}
      <section
        id="contact"
        className="relative px-6 md:px-12 py-28 md:py-36 z-10"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <RevealOnScroll direction="left">
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-violet-400">
                Contact
              </span>
              <h2 className="text-4xl md:text-6xl font-bold mt-3 tracking-tight leading-tight">
                Let&apos;s build something{" "}
                <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  amazing
                </span>{" "}
                together.
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.2}>
              <div className="bg-white/3 backdrop-blur-xl border border-white/6 rounded-3xl p-8 md:p-10 space-y-6">
                {email && (
                  <motion.a
                    whileHover={{ x: 6 }}
                    href={`mailto:${email}`}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 group-hover:bg-violet-500/20 transition-colors">
                      <svg
                        className="w-5 h-5 text-violet-400"
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
                      <p className="text-xs text-white/30 tracking-wider uppercase">
                        Email
                      </p>
                      <p className="text-sm text-white/70 group-hover:text-violet-300 transition-colors">
                        {email}
                      </p>
                    </div>
                  </motion.a>
                )}
                {phone && (
                  <motion.a
                    whileHover={{ x: 6 }}
                    href={`tel:${phone}`}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center shrink-0 group-hover:bg-fuchsia-500/20 transition-colors">
                      <svg
                        className="w-5 h-5 text-fuchsia-400"
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
                      <p className="text-xs text-white/30 tracking-wider uppercase">
                        Phone
                      </p>
                      <p className="text-sm text-white/70 group-hover:text-fuchsia-300 transition-colors">
                        {phone}
                      </p>
                    </div>
                  </motion.a>
                )}
                {location && (
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5 text-pink-400"
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
                      <p className="text-xs text-white/30 tracking-wider uppercase">
                        Location
                      </p>
                      <p className="text-sm text-white/70">{location}</p>
                    </div>
                  </div>
                )}
                {socialLinks.length > 0 && (
                  <div className="flex items-center gap-3 pt-5 border-t border-white/6">
                    {socialLinks.map((l, i) => (
                      <motion.a
                        key={i}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.15, y: -2 }}
                        className="w-10 h-10 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center text-white/30 hover:text-violet-400 hover:border-violet-500/30 transition-colors"
                        title={l.platform}
                      >
                        <SocialIcon platform={l.platform} />
                      </motion.a>
                    ))}
                  </div>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="relative border-t border-white/4 px-6 md:px-12 py-8 z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-white/20 tracking-wider"
          >
            © {new Date().getFullYear()} {name}. Built with ♥
          </motion.p>
          <motion.a
            href="#hero"
            whileHover={{ y: -3 }}
            className="text-xs text-white/20 hover:text-violet-400 tracking-wider transition-colors"
          >
            Back to top ↑
          </motion.a>
        </div>
      </footer>
    </div>
  );
}
