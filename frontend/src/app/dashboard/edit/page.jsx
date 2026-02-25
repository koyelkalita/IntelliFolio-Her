"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard";
import { useAuth } from "@/contexts/AuthContext";
import {
  generatePortfolio,
  getPortfolios,
  getPortfolioProfile,
  getPortfolioSkills,
  getPortfolioProjects,
  getPortfolioSocialLinks,
  getPortfolioSections,
  saveProfileData,
  deleteSkill,
  bulkCreateSkills,
  deleteSocialLink,
  bulkCreateSocialLinks,
  createSection,
  updateSection,
  createProject,
  deleteProject,
} from "@/lib/api";

export default function EditPortfolioPage() {
  const { currentUser } = useAuth();
  const [currentSection, setCurrentSection] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portfolioId, setPortfolioId] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [existingIds, setExistingIds] = useState({
    skills: [],
    socialLinks: [],
    projects: [],
    sections: {},
  });

  const sections = [
    "Personal Information",
    "AI-Generated Summary",
    "Enhanced Content",
    "Skills",
    "Work Experience",
    "Education",
    "Projects",
    "Publications",
    "Awards",
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
    twitter: "",
    instagram: "",
    facebook: "",
    youtube: "",
    googleScholar: "",
    dribbble: "",
    calendly: "",
    aiSummary: "",
    headline: "",
    bio: "",
    technicalSkills: [],
    softSkills: [],
    languages: [],
  });

  const [workExperience, setWorkExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [publications, setPublications] = useState([]);
  const [awards, setAwards] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  const handleGenerate = async () => {
    const result = await generatePortfolio({
      formData,
      workExperience,
      education,
      projects,
      publications,
      awards,
    });

    console.log(result);
  };

  // ─── Load portfolio data from API ───
  useEffect(() => {
    async function loadPortfolioData() {
      try {
        if (!currentUser) {
          setFetchError("Please sign in to edit your portfolio.");
          setInitialLoading(false);
          return;
        }

        const token = await currentUser.getIdToken();
        const portfoliosRes = await getPortfolios(token);

        if (
          portfoliosRes.status !== "success" ||
          !portfoliosRes.portfolios?.length
        ) {
          setFetchError(
            "No portfolios found. Build a profile first from the dashboard.",
          );
          setInitialLoading(false);
          return;
        }

        // Find portfolio matching URL slug, or find the best one with data
        const params = new URLSearchParams(window.location.search);
        const slug = params.get("portfolio");
        let portfolio;
        if (slug) {
          portfolio = portfoliosRes.portfolios.find((p) => p.slug === slug);
        }

        // Sort by created_at descending (newest first)
        const sorted = [...portfoliosRes.portfolios].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );

        // If no slug match, find the first portfolio that has profile data
        if (!portfolio) {
          for (const candidate of sorted) {
            const testProfile = await getPortfolioProfile(candidate.id);
            if (testProfile) {
              portfolio = candidate;
              break;
            }
          }
        }

        if (!portfolio) {
          setFetchError("No portfolio with data found. Build a profile first.");
          setInitialLoading(false);
          return;
        }

        const pId = portfolio.id;
        setPortfolioId(pId);

        // Fetch all data in parallel
        const [profile, skills, projectsData, socialLinks, sections] =
          await Promise.all([
            getPortfolioProfile(pId),
            getPortfolioSkills(pId),
            getPortfolioProjects(pId),
            getPortfolioSocialLinks(pId),
            getPortfolioSections(pId),
          ]);

        // Map social links to a flat lookup
        const socialMap = {};
        for (const link of socialLinks || []) {
          socialMap[link.platform] = link.url || "";
        }

        // Map skills by category
        const technicalSkills = (skills || [])
          .filter((s) => s.category === "technical")
          .map((s) => s.skill_name);
        const softSkills = (skills || [])
          .filter((s) => s.category === "soft")
          .map((s) => s.skill_name);
        const languages = (skills || [])
          .filter((s) => s.category === "language")
          .map((s) => s.skill_name);

        // Set form data from profile + social links + skills
        setFormData({
          name: profile?.name || "",
          email: profile?.email || "",
          phone: profile?.phone || "",
          location: profile?.location || "",
          linkedin: socialMap.linkedin || "",
          github: socialMap.github || "",
          website: socialMap.website || "",
          twitter: socialMap.twitter || "",
          instagram: socialMap.instagram || "",
          facebook: socialMap.facebook || "",
          youtube: socialMap.youtube || "",
          googleScholar: socialMap.google_scholar || "",
          dribbble: socialMap.dribbble || "",
          calendly: socialMap.calendly || "",
          aiSummary: profile?.summary || "",
          headline: profile?.merged_data?.headline || "",
          bio: profile?.merged_data?.bio || "",
          technicalSkills,
          softSkills,
          languages,
        });

        // Map sections to respective state
        for (const section of sections || []) {
          const content = Array.isArray(section.content) ? section.content : [];
          switch (section.section_type) {
            case "experience":
              setWorkExperience(
                content.map((item, i) => {
                  // Parse "duration" into startDate/endDate if needed
                  let startDate = item.startDate || "";
                  let endDate = item.endDate || "";
                  let current = item.current || false;
                  if (!startDate && item.duration) {
                    const parts = item.duration.split(/\s*[-–]\s*/);
                    startDate = parts[0]?.trim() || "";
                    endDate = parts[1]?.trim() || "";
                    if (endDate.toLowerCase() === "present") {
                      current = true;
                    }
                  }
                  return {
                    ...item,
                    id: item.id || i + 1,
                    title: item.title || "",
                    company: item.company || item.organization || "",
                    location: item.location || "",
                    startDate,
                    endDate,
                    current,
                    description: Array.isArray(item.description)
                      ? item.description.join(" ")
                      : item.description || "",
                    achievements: item.achievements || [],
                  };
                }),
              );
              break;
            case "education":
              setEducation(
                content.map((item, i) => ({
                  ...item,
                  id: item.id || i + 1,
                  degree: item.degree || "",
                  field: item.field || "",
                  institution: item.institution || item.school || "",
                  location: item.location || "",
                  startDate: item.startDate || "",
                  endDate: item.endDate || "",
                  gpa: item.gpa || "",
                  achievements: item.achievements || [],
                })),
              );
              break;
            case "publications":
              setPublications(
                content.map((item, i) => ({
                  ...item,
                  id: item.id || i + 1,
                  achievements: item.achievements || [],
                })),
              );
              break;
            case "awards":
              setAwards(
                content.map((item, i) => ({
                  ...item,
                  id: item.id || i + 1,
                  achievements: item.achievements || [],
                })),
              );
              break;
          }
        }

        // Map projects
        if (projectsData?.length) {
          setProjects(
            projectsData.map((p) => ({
              id: p.id,
              name: p.name || "",
              description: p.description || "",
              technologies: p.technologies || [],
              link: p.url || "",
              demoLink: p.github_url || "",
              startDate: p.start_date || "",
              endDate: p.end_date || "Present",
            })),
          );
        }

        // Store existing IDs for save operations
        setExistingIds({
          skills: (skills || []).map((s) => s.id),
          socialLinks: (socialLinks || []).map((l) => l.id),
          projects: (projectsData || []).map((p) => p.id),
          sections: Object.fromEntries(
            (sections || []).map((s) => [s.section_type, s.id]),
          ),
        });
      } catch (err) {
        console.error("Failed to load portfolio data:", err);
        setFetchError("Failed to load portfolio data. Please try again.");
      } finally {
        setInitialLoading(false);
      }
    }

    loadPortfolioData();
  }, [currentUser]);

  // ─── Save all portfolio data ───
  const handleSave = async () => {
    if (!portfolioId) return;
    setSaving(true);

    try {
      // 1. Save profile data (upsert)
      await saveProfileData(portfolioId, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        summary: formData.aiSummary,
        merged_data: {
          headline: formData.headline,
          bio: formData.bio,
        },
      });

      // 2. Replace skills: delete old, bulk create new
      for (const id of existingIds.skills) {
        await deleteSkill(id);
      }
      const allSkills = [
        ...formData.technicalSkills.map((name) => ({
          skill_name: name,
          category: "technical",
        })),
        ...formData.softSkills.map((name) => ({
          skill_name: name,
          category: "soft",
        })),
        ...formData.languages.map((name) => ({
          skill_name: name,
          category: "language",
        })),
      ];
      const newSkills = await bulkCreateSkills(portfolioId, allSkills);
      setExistingIds((prev) => ({
        ...prev,
        skills: (newSkills || []).map((s) => s.id),
      }));

      // 3. Replace social links: delete old, bulk create new
      for (const id of existingIds.socialLinks) {
        await deleteSocialLink(id);
      }
      const socialLinksData = [];
      const socialFieldMap = {
        linkedin: "linkedin",
        github: "github",
        website: "website",
        twitter: "twitter",
        instagram: "instagram",
        facebook: "facebook",
        youtube: "youtube",
        googleScholar: "google_scholar",
        dribbble: "dribbble",
        calendly: "calendly",
      };
      for (const [field, platform] of Object.entries(socialFieldMap)) {
        if (formData[field]) {
          socialLinksData.push({ platform, url: formData[field] });
        }
      }
      const newLinks = await bulkCreateSocialLinks(
        portfolioId,
        socialLinksData,
      );
      setExistingIds((prev) => ({
        ...prev,
        socialLinks: (newLinks || []).map((l) => l.id),
      }));

      // 4. Save sections (experience, education, publications, awards)
      const sectionMap = {
        experience: workExperience,
        education: education,
        publications: publications,
        awards: awards,
      };
      const newSectionIds = { ...existingIds.sections };
      for (const [sectionType, content] of Object.entries(sectionMap)) {
        const existingSectionId = existingIds.sections[sectionType];
        // Strip client-side ids from content before saving
        const cleanContent = content.map(({ id, ...rest }) => rest);
        if (existingSectionId) {
          await updateSection(existingSectionId, {
            content: cleanContent,
          });
        } else if (cleanContent.length > 0) {
          const newSection = await createSection(portfolioId, {
            section_type: sectionType,
            content: cleanContent,
            order_index: Object.keys(sectionMap).indexOf(sectionType),
          });
          newSectionIds[sectionType] = newSection.id;
        }
      }
      setExistingIds((prev) => ({ ...prev, sections: newSectionIds }));

      // 5. Replace projects: delete old, create new
      for (const id of existingIds.projects) {
        await deleteProject(id);
      }
      const newProjectIds = [];
      for (const project of projects) {
        const result = await createProject(portfolioId, {
          name: project.name,
          description: project.description,
          url: project.link,
          github_url: project.demoLink,
          technologies: project.technologies,
          start_date: project.startDate || null,
          end_date:
            project.endDate === "Present" ? null : project.endDate || null,
        });
        newProjectIds.push(result.id);
      }
      setExistingIds((prev) => ({ ...prev, projects: newProjectIds }));

      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getSectionIcon = (section) => {
    switch (section) {
      case "Personal Information":
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        );
      case "AI-Generated Summary":
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
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case "Enhanced Content":
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
      case "Skills":
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
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        );
      case "Work Experience":
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
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case "Education":
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
              d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
            />
          </svg>
        );
      case "Projects":
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
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        );
      case "Publications":
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        );
      case "Awards":
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
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderPersonalInformation = () => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center text-xl font-semibold text-gray-600">
            {getInitials(formData.name)}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Phone and Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Social Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn
            </label>
            <input
              type="text"
              value={formData.linkedin}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
              disabled={!isEditing}
              placeholder="Not provided"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub
            </label>
            <input
              type="text"
              value={formData.github}
              onChange={(e) => handleInputChange("github", e.target.value)}
              disabled={!isEditing}
              placeholder="Not provided"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              disabled={!isEditing}
              placeholder="Not provided"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>

          {/* Twitter/X */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter/X
            </label>
            <input
              type="text"
              value={formData.twitter}
              onChange={(e) => handleInputChange("twitter", e.target.value)}
              disabled={!isEditing}
              placeholder="Not provided"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => handleInputChange("instagram", e.target.value)}
              disabled={!isEditing}
              placeholder="Not provided"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>

          {/* Facebook */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook
            </label>
            <input
              type="text"
              value={formData.facebook}
              onChange={(e) => handleInputChange("facebook", e.target.value)}
              disabled={!isEditing}
              placeholder="Not provided"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>

          {/* YouTube */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube
            </label>
            <input
              type="text"
              value={formData.youtube}
              onChange={(e) => handleInputChange("youtube", e.target.value)}
              disabled={!isEditing}
              placeholder="Not provided"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>

          {/* Google Scholar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Scholar
            </label>
            <input
              type="text"
              value={formData.googleScholar}
              onChange={(e) =>
                handleInputChange("googleScholar", e.target.value)
              }
              disabled={!isEditing}
              placeholder="Not provided"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>

          {/* Dribbble */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dribbble
            </label>
            <input
              type="text"
              value={formData.dribbble}
              onChange={(e) => handleInputChange("dribbble", e.target.value)}
              disabled={!isEditing}
              placeholder="Not provided"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>

          {/* Calendly */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calendly/Cal.com
            </label>
            <input
              type="text"
              value={formData.calendly}
              onChange={(e) => handleInputChange("calendly", e.target.value)}
              disabled={!isEditing}
              placeholder="Not provided"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAISummary = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 text-purple-700 mb-2">
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="font-medium">AI-Generated Content</span>
        </div>
        <p className="text-sm text-purple-600">
          This summary was automatically generated based on your resume. You can
          edit it to better reflect your professional identity.
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Summary
        </label>
        <textarea
          value={formData.aiSummary}
          onChange={(e) => handleInputChange("aiSummary", e.target.value)}
          disabled={!isEditing}
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2">
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Regenerate Summary
        </button>
      </div>
    </div>
  );

  const renderEnhancedContent = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Headline
        </label>
        <input
          type="text"
          value={formData.headline}
          onChange={(e) => handleInputChange("headline", e.target.value)}
          disabled={!isEditing}
          placeholder="e.g., Full Stack Developer | ML Enthusiast"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio / About Me
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          disabled={!isEditing}
          rows={6}
          placeholder="Tell your story..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Technical Skills
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.technicalSkills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2"
            >
              {skill}
              {isEditing && (
                <button
                  onClick={() => {
                    const newSkills = formData.technicalSkills.filter(
                      (_, i) => i !== index,
                    );
                    handleInputChange("technicalSkills", newSkills);
                  }}
                  className="hover:text-blue-600"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </span>
          ))}
        </div>
        {isEditing && (
          <input
            type="text"
            placeholder="Add a skill and press Enter"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                handleInputChange("technicalSkills", [
                  ...formData.technicalSkills,
                  e.target.value.trim(),
                ]);
                e.target.value = "";
              }
            }}
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Soft Skills
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.softSkills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-2"
            >
              {skill}
              {isEditing && (
                <button
                  onClick={() => {
                    const newSkills = formData.softSkills.filter(
                      (_, i) => i !== index,
                    );
                    handleInputChange("softSkills", newSkills);
                  }}
                  className="hover:text-green-600"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </span>
          ))}
        </div>
        {isEditing && (
          <input
            type="text"
            placeholder="Add a soft skill and press Enter"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                handleInputChange("softSkills", [
                  ...formData.softSkills,
                  e.target.value.trim(),
                ]);
                e.target.value = "";
              }
            }}
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Languages
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.languages.map((lang, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center gap-2"
            >
              {lang}
              {isEditing && (
                <button
                  onClick={() => {
                    const newLangs = formData.languages.filter(
                      (_, i) => i !== index,
                    );
                    handleInputChange("languages", newLangs);
                  }}
                  className="hover:text-purple-600"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </span>
          ))}
        </div>
        {isEditing && (
          <input
            type="text"
            placeholder="Add a language and press Enter"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                handleInputChange("languages", [
                  ...formData.languages,
                  e.target.value.trim(),
                ]);
                e.target.value = "";
              }
            }}
          />
        )}
      </div>
    </div>
  );

  const renderWorkExperience = () => (
    <div className="space-y-6">
      {workExperience.map((exp, index) => (
        <div
          key={exp.id}
          className="border border-gray-200 rounded-lg p-5 bg-gray-50/50"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold text-gray-900">{exp.title}</h4>
              <p className="text-gray-600">
                {exp.company} • {exp.location}
              </p>
              <p className="text-sm text-gray-500">
                {exp.startDate} - {exp.current ? "Present" : exp.endDate}
              </p>
            </div>
            {isEditing && (
              <button
                onClick={() =>
                  setWorkExperience(
                    workExperience.filter((_, i) => i !== index),
                  )
                }
                className="text-red-500 hover:text-red-700"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
          <p className="text-gray-700 mb-3">{exp.description}</p>
          {exp.achievements && exp.achievements.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Key Achievements:
              </p>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                {exp.achievements.map((achievement, i) => (
                  <li key={i}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
      {isEditing && (
        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2">
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Work Experience
        </button>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      {education.map((edu, index) => {
        console.log("education: ", edu);
        return (
          <div
            key={edu.id}
            className="border border-gray-200 rounded-lg p-5 bg-gray-50/50"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {edu.degree} in {edu.field}
                </h4>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">
                  {edu.location} • {edu.startDate} - {edu.endDate}
                </p>
                {edu.gpa && (
                  <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                )}
              </div>
              {isEditing && (
                <button
                  onClick={() =>
                    setEducation(education.filter((_, i) => i !== index))
                  }
                  className="text-red-500 hover:text-red-700"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
            {edu.achievements && edu.achievements.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {edu.achievements.map((achievement, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm"
                  >
                    {achievement}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {isEditing && (
        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2">
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Education
        </button>
      )}
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="border border-gray-200 rounded-lg p-5 bg-gray-50/50"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">{project.name}</h4>
              <p className="text-sm text-gray-500">
                {project.startDate} - {project.endDate}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
              {isEditing && (
                <button
                  onClick={() =>
                    setProjects(projects.filter((_, i) => i !== index))
                  }
                  className="text-red-500 hover:text-red-700"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-700 mb-3">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
      {isEditing && (
        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2">
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Project
        </button>
      )}
    </div>
  );

  const renderPublications = () => (
    <div className="space-y-6">
      {publications.map((pub, index) => (
        <div
          key={pub.id}
          className="border border-gray-200 rounded-lg p-5 bg-gray-50/50"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900">{pub.title}</h4>
              <p className="text-gray-600">{pub.authors}</p>
              <p className="text-sm text-gray-500">
                {pub.journal} • {pub.year}
              </p>
              {pub.doi && (
                <p className="text-sm text-blue-600">DOI: {pub.doi}</p>
              )}
            </div>
            {isEditing && (
              <button
                onClick={() =>
                  setPublications(publications.filter((_, i) => i !== index))
                }
                className="text-red-500 hover:text-red-700"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
      {publications.length === 0 && !isEditing && (
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-gray-300"
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
          <p>No publications added yet</p>
        </div>
      )}
      {isEditing && (
        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2">
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Publication
        </button>
      )}
    </div>
  );

  const renderAwards = () => (
    <div className="space-y-6">
      {awards.map((award, index) => (
        <div
          key={award.id}
          className="border border-gray-200 rounded-lg p-5 bg-gray-50/50"
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-yellow-600"
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
                <h4 className="font-semibold text-gray-900">{award.title}</h4>
                <p className="text-gray-600">
                  {award.organization} • {award.year}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {award.description}
                </p>
              </div>
            </div>
            {isEditing && (
              <button
                onClick={() => setAwards(awards.filter((_, i) => i !== index))}
                className="text-red-500 hover:text-red-700"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
      {awards.length === 0 && !isEditing && (
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-gray-300"
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
          <p>No awards added yet</p>
        </div>
      )}
      {isEditing && (
        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2">
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Award
        </button>
      )}
    </div>
  );

  const renderSectionContent = () => {
    switch (sections[currentSection]) {
      case "Personal Information":
        return renderPersonalInformation();
      case "AI-Generated Summary":
        return renderAISummary();
      case "Enhanced Content":
        return renderEnhancedContent();
      case "Skills":
        return renderSkills();
      case "Work Experience":
        return renderWorkExperience();
      case "Education":
        return renderEducation();
      case "Projects":
        return renderProjects();
      case "Publications":
        return renderPublications();
      case "Awards":
        return renderAwards();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#f5f0eb] border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Review & Edit Resume
          </h1>
        </header>

        {/* Content Area */}
        <div className="flex-1 px-8 py-6 overflow-auto">
          {initialLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading portfolio data...</p>
              </div>
            </div>
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <p className="text-red-600 font-medium">{fetchError}</p>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 underline hover:text-gray-800"
              >
                Back to Dashboard
              </Link>
            </div>
          ) : (
            <>
              {/* Status Bar */}
              <div className="flex items-center justify-between mb-6 bg-white rounded-lg border border-gray-200 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-800 rounded-full"></span>
                  <span className="text-sm text-gray-600">✓ Ready to edit</span>
                </div>
                <button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  disabled={saving}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isEditing
                      ? "bg-gray-600 text-white hover:bg-gray-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {saving
                    ? "Saving..."
                    : isEditing
                      ? "Save Data"
                      : "✏ Edit Data"}
                </button>
              </div>

              {/* Section Card */}
              <div className="bg-white rounded-lg border border-gray-200">
                {/* Section Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">
                      {getSectionIcon(sections[currentSection])}
                    </span>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {sections[currentSection]}
                    </h2>
                  </div>

                  {/* Section Dots */}
                  <div className="flex items-center gap-2">
                    {sections.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSection(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          index === currentSection
                            ? "bg-gray-800"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
                  <button
                    onClick={() =>
                      setCurrentSection(Math.max(0, currentSection - 1))
                    }
                    disabled={currentSection === 0}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentSection(
                        Math.min(sections.length - 1, currentSection + 1),
                      )
                    }
                    disabled={currentSection === sections.length - 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Section Content */}
                <div className="p-6">{renderSectionContent()}</div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-[#f5f0eb] border-t border-gray-200 px-8 py-6">
          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              {loading ? "Generating..." : "Create Portfolio Site →"}
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
