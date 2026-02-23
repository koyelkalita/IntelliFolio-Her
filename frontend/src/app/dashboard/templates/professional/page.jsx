"use client";

import React from "react";

// --- DEFAULT DATA ---
const defaultData = {
  name: "Elon Musk",
  title: "Pioneering the future of humanity",
  navLinks: [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ],
  about: {
    heading: "About Me",
    description:
      "I'm a passionate developer and entrepreneur focused on building innovative solutions that push the boundaries of technology. With expertise in full-stack development, I create seamless digital experiences that make a difference.",
    image: null,
  },
  experience: [
    {
      company: "SpaceX",
      role: "CEO & Lead Designer",
      period: "2002 - Present",
      description: "Leading the development of advanced rocket technology.",
    },
    {
      company: "Tesla",
      role: "CEO",
      period: "2008 - Present",
      description: "Accelerating the world's transition to sustainable energy.",
    },
    {
      company: "Neuralink",
      role: "Co-Founder",
      period: "2016 - Present",
      description: "Developing brain-computer interface technology.",
    },
  ],
  projects: [
    {
      title: "Starship",
      description: "Next-generation fully reusable spacecraft.",
      tags: ["Aerospace", "Engineering"],
    },
    {
      title: "Model S",
      description: "Revolutionary electric vehicle with autopilot.",
      tags: ["EV", "AI", "Automotive"],
    },
    {
      title: "Hyperloop",
      description: "High-speed transportation system concept.",
      tags: ["Transportation", "Innovation"],
    },
  ],
  contact: {
    email: "contact@example.com",
    linkedin: "linkedin.com/in/example",
    github: "github.com/example",
  },
  stats: [
    { value: "50+", label: "Projects" },
    { value: "10+", label: "Years" },
    { value: "100M+", label: "Users" },
  ],
};

// --- PROFESSIONAL PORTFOLIO COMPONENT ---
const ProfessionalPortfolio = ({
  name = defaultData.name,
  title = defaultData.title,
  navLinks = defaultData.navLinks,
  about = defaultData.about,
  experience = defaultData.experience,
  projects = defaultData.projects,
  contact = defaultData.contact,
  stats = defaultData.stats,
}) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#" className="text-xl font-bold">
            {name.split(" ")[0]}
            <span className="text-blue-500">.</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href="#contact"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center pt-20">
          {/* Left - Text Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              {name.split(" ").map((word, i) => (
                <span key={i} className="block">
                  {word}
                </span>
              ))}
            </h1>
            <p className="text-xl text-gray-400">{title}</p>
            <div className="flex gap-4 pt-4">
              <a
                href="#projects"
                className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                View Projects
              </a>
              <a
                href="#about"
                className="px-6 py-3 border border-gray-700 rounded-lg font-medium hover:border-gray-500 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right - Image/Visual */}
          <div className="relative">
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
              Available for work
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            {about.heading}
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <p className="text-gray-400 text-lg leading-relaxed">
              {about.description}
            </p>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "React",
                  "Next.js",
                  "TypeScript",
                  "Node.js",
                  "Python",
                  "AWS",
                  "Docker",
                  "PostgreSQL",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 bg-gray-800/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Experience</h2>
          <div className="space-y-8">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-6 p-6 bg-gray-800/50 rounded-xl border border-gray-700"
              >
                <div className="md:w-1/4">
                  <p className="text-gray-500 text-sm">{exp.period}</p>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-xl font-semibold">{exp.role}</h3>
                  <p className="text-blue-500 mb-2">{exp.company}</p>
                  <p className="text-gray-400">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-500 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gray-800/30">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Let's Work Together
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            I'm always interested in hearing about new projects and
            opportunities. Feel free to reach out!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${contact.email}`}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Send Email
            </a>
            <a
              href={`https://${contact.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-gray-700 hover:border-gray-500 rounded-lg font-medium transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={`https://${contact.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-gray-700 hover:border-gray-500 rounded-lg font-medium transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm">Made with IntelliFolio</p>
        </div>
      </footer>
    </div>
  );
};

export default function ProfessionalTemplatePage() {
  return <ProfessionalPortfolio />;
}
