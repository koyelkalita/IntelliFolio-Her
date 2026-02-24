"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getPublicPortfolio } from "@/lib/api";

export default function PortfolioPage() {
  const params = useParams();
  const slug = params.slug;
  
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await getPublicPortfolio(slug);
        
        if (response.status === "error") {
          setError(response.message || "Portfolio not found");
          return;
        }
        
        setPortfolio(response.portfolio);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError("Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPortfolio();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Loading portfolio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Portfolio Not Found</h1>
          <p className="text-gray-400">The portfolio you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const profile = portfolio.profile || {};
  const sections = profile.sections || {};
  const allProjects = profile.projects || [];
  const allSkills = profile.allSkills || { technical: [], soft: [], language: [] };
  
  // Contemporary template - Dark with effects and full content
  if (portfolio.template_type === "contemporary") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center pb-20">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
              {profile.name || "Portfolio"}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl">
              {profile.summary || "Welcome to my portfolio"}
            </p>

            <a href="#about" className="inline-block px-8 py-3 border border-gray-500 text-white rounded-full hover:bg-gray-900 transition-colors mb-16">
              Explore my work →
            </a>

            {/* Contact Info */}
            <div className="space-y-4 text-gray-400">
              {profile.email && (
                <p>
                  <a href={`mailto:${profile.email}`} className="text-blue-400 hover:underline">{profile.email}</a>
                </p>
              )}
              {profile.github_username && (
                <p>
                  <a href={`https://github.com/${profile.github_username}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    github.com/{profile.github_username}
                  </a>
                </p>
              )}
              {profile.location && (
                <p>📍 {profile.location}</p>
              )}
            </div>
          </div>

          {/* About Section */}
          <section id="about" className="py-20 px-6 max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">About</h2>
            <p className="text-gray-300 text-lg leading-relaxed text-center max-w-3xl mx-auto">
              {profile.summary || "Welcome to my portfolio"}
            </p>
          </section>

          {/* Technical Skills Section */}
          {(allSkills.technical && allSkills.technical.length > 0) && (
            <section className="py-20 px-6 max-w-5xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-12 text-center">Technical Skills</h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {allSkills.technical.map((skill, idx) => (
                  <span key={idx} className="px-6 py-3 bg-gray-800/50 text-gray-300 rounded-full text-sm border border-gray-700 hover:border-blue-500 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {allProjects && allProjects.length > 0 && (
            <section id="projects" className="py-20 px-6 max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-12 text-center">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {allProjects.map((project, idx) => (
                  <div key={idx} className="bg-gray-800/30 border border-gray-700 rounded-lg p-8 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                    <h3 className="text-2xl font-bold text-white mb-3">{project.name}</h3>
                    {project.description && (
                      <p className="text-gray-300 mb-4">{project.description}</p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech, tidx) => (
                          <span key={tidx} className="text-xs bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {(project.url || project.github_url) && (
                      <div className="flex gap-4">
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                            View Project →
                          </a>
                        )}
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                            GitHub →
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience Section */}
          {sections && sections.experience && (
            <section className="py-20 px-6 max-w-5xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-12 text-center">Experience</h2>
              <div className="space-y-8">
                {Array.isArray(sections.experience) ? sections.experience.map((exp, idx) => (
                  <div key={idx} className="border-l-2 border-blue-500 pl-8">
                    <h3 className="text-2xl font-bold text-white">{exp.title}</h3>
                    <p className="text-blue-400 font-semibold text-lg">{exp.company}</p>
                    {exp.startDate || exp.endDate ? (
                      <p className="text-gray-400 text-sm mb-3">
                        {exp.startDate} {exp.endDate && `- ${exp.endDate}`}
                      </p>
                    ) : null}
                    {exp.description && <p className="text-gray-300 leading-relaxed">{exp.description}</p>}
                  </div>
                )) : null}
              </div>
            </section>
          )}

          {/* Education Section */}
          {sections && sections.education && (
            <section className="py-20 px-6 max-w-5xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-12 text-center">Education</h2>
              <div className="space-y-8">
                {Array.isArray(sections.education) ? sections.education.map((edu, idx) => (
                  <div key={idx} className="border-l-2 border-purple-500 pl-8">
                    <h3 className="text-2xl font-bold text-white">{edu.school || edu.institution}</h3>
                    <p className="text-purple-400 font-semibold text-lg">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</p>
                    {edu.graduation_date && <p className="text-gray-400 text-sm">{edu.graduation_date}</p>}
                  </div>
                )) : null}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  // Professional template - Full-featured layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-20 border-b border-slate-700 pb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {profile.name || "Portfolio"}
          </h1>
          
          {profile.location && (
            <p className="text-gray-300 mb-4">📍 {profile.location}</p>
          )}
          
          <p className="text-xl text-gray-400 mb-8 max-w-3xl">
            {profile.summary || "Professional Developer"}
          </p>

          {/* Contact Info */}
          <div className="flex flex-wrap gap-6 text-gray-300">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="text-blue-400 hover:underline flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                {profile.email}
              </a>
            )}
            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="text-blue-400 hover:underline flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.436a1 1 0 01-.54 1.06l-1.823.912c.487 1.703 2.217 3.433 3.92 3.92l.912-1.823a1 1 0 011.06-.54l4.436.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                {profile.phone}
              </a>
            )}
            {profile.github_username && (
              <a href={`https://github.com/${profile.github_username}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.005.07 1.535 1.032 1.535 1.032.892 1.53 2.341 1.544 2.914 1.186.092-.923.35-1.544.636-1.9-2.22-.253-4.555-1.112-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.013 2.415-.013 2.743 0 .267.18.578.688.48C17.138 18.19 20 14.412 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd"></path></svg>
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Technical Skills Section */}
        {(allSkills.technical && allSkills.technical.length > 0) && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Technical Skills</h2>
            <div className="flex flex-wrap gap-3">
              {allSkills.technical.map((skill, idx) => (
                <span key={idx} className="px-4 py-2 bg-slate-700 text-slate-100 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Soft Skills Section */}
        {(allSkills.soft && allSkills.soft.length > 0) && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Soft Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allSkills.soft.map((skill, idx) => (
                <div key={idx} className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages Section */}
        {(allSkills.language && allSkills.language.length > 0) && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Languages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allSkills.language.map((lang, idx) => (
                <div key={idx} className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 5a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" clipRule="evenodd"></path></svg>
                  {lang}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {allProjects && allProjects.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allProjects.map((project, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition-colors">
                  <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                  {project.description && (
                    <p className="text-gray-300 mb-4">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, tidx) => (
                        <span key={tidx} className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {(project.url || project.github_url) && (
                    <div className="flex gap-3">
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
                          View Project →
                        </a>
                      )}
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
                          GitHub →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {sections && sections.experience && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Work Experience</h2>
            <div className="space-y-6">
              {Array.isArray(sections.experience) ? sections.experience.map((exp, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                  <p className="text-blue-400 font-medium">{exp.company}</p>
                  {exp.startDate || exp.endDate ? (
                    <p className="text-gray-400 text-sm">
                      {exp.startDate} {exp.endDate && `- ${exp.endDate}`} {exp.current && <span className="text-green-400">• Current</span>}
                    </p>
                  ) : null}
                  {exp.description && <p className="text-gray-300 mt-2">{exp.description}</p>}
                </div>
              )) : null}
            </div>
          </div>
        )}

        {/* Education Section */}
        {sections && sections.education && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Education</h2>
            <div className="space-y-6">
              {Array.isArray(sections.education) ? sections.education.map((edu, idx) => (
                <div key={idx} className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-bold text-white">{edu.school || edu.institution}</h3>
                  <p className="text-purple-400 font-medium">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</p>
                  {edu.graduation_date && <p className="text-gray-400 text-sm">{edu.graduation_date}</p>}
                </div>
              )) : null}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {sections && sections.certifications && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Certifications</h2>
            <div className="space-y-3">
              {Array.isArray(sections.certifications) ? sections.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
                  <div>
                    <p className="text-white font-medium">{cert.name}</p>
                    {cert.issuer && <p className="text-gray-400 text-sm">{cert.issuer}</p>}
                  </div>
                </div>
              )) : null}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-700 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

