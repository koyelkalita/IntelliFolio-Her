"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Particles } from "@/components/ui/particles";
function LandingPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type === "application/pdf" || file.name.endsWith(".docx")) {
      setUploadedFile(file);
    } else {
      alert("Please upload a PDF or DOCX file");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-medium ">
          <span className="text-gray-800">&lt;Intelli</span>
          <span className="text-red-500">Folio</span>
          <span className="text-blue-500">-</span>
          <span className="text-gray-800">Her&gt;</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Link
            href="/blog"
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/careers"
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            Careers
          </Link>
          <Link
            href="/dashboard"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
          >
            Go to Dashboard
          </Link>
        </nav>
      </header>
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto h-[calc(100vh-186px)] px-8 pt-16 pb-24 flex items-center justify-between">
        <div className="w-full flex items-center justify-between gap-16">
          {/* Left Content */}
          <div className="flex-1">
            <h1 className="text-6xl font-bold text-gray-900 leading-tight mb-4">
              Build your
              <br />
              personal website
            </h1>

            <p className="text-gray-600 text-lg mb-8">show off in style</p>
            <Link
              href="/dashboard"
              className="inline-block bg-black text-white px-8 py-4 rounded-md hover:bg-gray-800 transition-colors font-medium text-lg"
            >
              Go to Dashboard
            </Link>
          </div>

          {/* Right Content - Upload Area */}
          <div className="flex-1 flex justify-center">
            <div
              onClick={handleUploadClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                w-full max-w-xl aspect-[4/2] p-25
                border-2 border-dashed rounded-2xl
                flex flex-col items-center justify-center
                cursor-pointer transition-all duration-200
                ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white/50 hover:border-gray-400 hover:bg-white/80"
                }
                ${uploadedFile ? "border-green-500 bg-green-50" : ""}
              `}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                accept=".pdf,.docx"
                className="hidden"
              />

              {/* Document Icon */}
              <div className="mb-4">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-purple-300"
                >
                  <path
                    d="M12 6C10.9 6 10 6.9 10 8V40C10 41.1 10.9 42 12 42H36C37.1 42 38 41.1 38 40V14L30 6H12Z"
                    fill="currentColor"
                    fillOpacity="0.3"
                  />
                  <path
                    d="M30 6V14H38"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 6H30L38 14V40C38 41.1 37.1 42 36 42H12C10.9 42 10 41.1 10 40V8C10 6.9 10.9 6 12 6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 22H32"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 28H32"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 34H26"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {uploadedFile ? (
                <>
                  <p className="text-gray-800 font-medium text-lg">
                    {uploadedFile.name}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Click to replace file
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-800 font-medium text-lg">
                    Upload your resume
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Drag & drop or click to upload resume
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color={"#000000"}
        refresh
      />
    </div>
  );
}

export default LandingPage;
