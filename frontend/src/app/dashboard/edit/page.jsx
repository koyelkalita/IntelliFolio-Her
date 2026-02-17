"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard";

export default function EditPortfolioPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);


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
    // Personal Information
    name: "Name Name",
    email: "name@gmail.com",
    phone: "+91 xxxxxxxxxx",
    location: "city, state",
    linkedin: "linkedin.com/in/xxx",
    github: "github.com/xxx",
    website: "",
    twitter: "",
    instagram: "",
    facebook: "",
    youtube: "",
    googleScholar: "",
    dribbble: "",
    calendly: "",
    // AI-Generated Summary
    aiSummary:
      "A passionate software developer with expertise in full-stack web development, machine learning, and cloud technologies. Proven track record of delivering high-quality solutions and leading cross-functional teams.",
    // Enhanced Content
    headline: "Full Stack Developer | ML Enthusiast | Open Source Contributor",
    bio: "I'm a software engineer passionate about building products that make a difference. With 3+ years of experience in web development and machine learning, I love tackling complex problems and turning ideas into reality.",
    // Skills
    technicalSkills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "TensorFlow",
      "PostgreSQL",
      "MongoDB",
      "AWS",
      "Docker",
      "Git",
    ],
    softSkills: [
      "Leadership",
      "Communication",
      "Problem Solving",
      "Team Collaboration",
      "Project Management",
    ],
    languages: ["English (Fluent)", "Hindi (Native)", "Assamese (Native)"],
  });

  const [workExperience, setWorkExperience] = useState([
    {
      id: 1,
      title: "Software Developer",
      company: "Tech Solutions Inc.",
      location: "Remote",
      startDate: "2023-01",
      endDate: "Present",
      current: true,
      description:
        "Developed and maintained full-stack web applications using React and Node.js. Led a team of 3 developers on key projects.",
      achievements: [
        "Increased application performance by 40%",
        "Implemented CI/CD pipeline reducing deployment time by 60%",
      ],
    },
    {
      id: 2,
      title: "Junior Developer",
      company: "StartUp Labs",
      location: "Bangalore, India",
      startDate: "2021-06",
      endDate: "2022-12",
      current: false,
      description:
        "Built responsive web interfaces and RESTful APIs. Collaborated with design team to implement UI/UX improvements.",
      achievements: [
        "Developed 5+ client-facing features",
        "Reduced bug count by 30% through automated testing",
      ],
    },
  ]);

  const [education, setEducation] = useState([
    {
      id: 1,
      degree: "Bachelor of Technology",
      field: "Computer Science & Engineering",
      institution: "xyz uni",
      location: "city, state",
      startDate: "2019",
      endDate: "2023",
      gpa: "8.5/10",
      achievements: ["Dean's List 2022", "Best Project Award"],
    },
  ]);

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "IntelliFolio",
      description:
        "AI-powered portfolio generator that creates personalized portfolio websites from resumes.",
      technologies: ["Next.js", "FastAPI", "OpenAI", "Tailwind CSS"],
      link: "https://github.com/koyelkalita/intellifolio",
      demoLink: "https://intellifolio.demo.com",
      startDate: "2024-01",
      endDate: "Present",
    },
    {
      id: 2,
      name: "Smart Task Manager",
      description:
        "A productivity app with AI-powered task prioritization and scheduling.",
      technologies: ["React Native", "Node.js", "MongoDB", "TensorFlow"],
      link: "https://github.com/koyelkalita/smart-task",
      demoLink: "",
      startDate: "2023-06",
      endDate: "2023-12",
    },
  ]);

  const [publications, setPublications] = useState([
    {
      id: 1,
      title: "Machine Learning Approaches for Resume Parsing",
      journal: "International Journal of Computer Science",
      authors: "name, Dr. A. Sharma",
      year: "2023",
      doi: "10.1234/ijcs.2023.001",
      link: "",
    },
  ]);

  const [awards, setAwards] = useState([
    {
      id: 1,
      title: "Best Innovation Award",
      organization: "Tech Summit 2023",
      year: "2023",
      description:
        "Awarded for developing an innovative AI-based solution for automated resume screening.",
    },
    {
      id: 2,
      title: "Hackathon Winner",
      organization: "CodeFest Northeast",
      year: "2022",
      description:
        "First place in the 24-hour hackathon for building a real-time collaboration tool.",
    },
  ]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
          {exp.achievements.length > 0 && (
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
      {education.map((edu, index) => (
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
  const handleGeneratePortfolio = async () => {
  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        formData,
        workExperience,
        education,
        projects,
        publications,
        awards
      })
    });

    const data = await res.json();

    if (data.status === "success") {
      window.open(`http://localhost:5000${data.url}`, "_blank");
    } else {
      alert("Generation failed");
    }

  } catch (err) {
    alert("Backend not running");
  }

  setLoading(false);
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
          {/* Status Bar */}
          <div className="flex items-center justify-between mb-6 bg-white rounded-lg border border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-800 rounded-full"></span>
              <span className="text-sm text-gray-600">✓ Ready to edit</span>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isEditing
                  ? "bg-gray-600 text-white hover:bg-gray-700"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isEditing ? "Save Data" : "✏ Edit Data"}
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
        </div>

        {/* Footer */}
        <footer className="bg-[#f5f0eb] border-t border-gray-200 px-8 py-6">
          <div className="flex justify-center">
            <button
              onClick={handleGeneratePortfolio}
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
