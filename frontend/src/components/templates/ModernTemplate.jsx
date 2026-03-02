import React from "react";

export default function ModernTemplate({ portfolio }) {
  // If no data is passed yet, show a placeholder
  const data = portfolio || {};

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-amber-100">
      {/* Navigation Header */}
      <nav className="max-w-6xl mx-auto p-6 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tighter">INTELLIFOLIO</div>
        <div className="space-x-6 text-sm font-medium text-gray-500 uppercase tracking-widest">
          <span>Projects</span>
          <span>Skills</span>
          <span>Contact</span>
        </div>
      </nav>

      {/* Hero / About Section */}
      <section className="max-w-4xl mx-auto py-24 px-6 text-center">
        <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tight">
          {data.name || "Portfolio Owner"}
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
          {data.about ||
            "This portfolio was generated using AI to highlight professional achievements and technical expertise."}
        </p>
      </section>

      {/* Projects Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-gray-400 uppercase tracking-widest text-center">
            Featured Work
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {data.projects?.length > 0 ? (
              data.projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-xl font-bold mb-3">{project.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-2 text-center text-gray-400">
                No projects generated yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer className="py-20 text-center">
        <p className="text-gray-400 text-sm">
          © 2026 {data.name} — Built with AI
        </p>
      </footer>
    </div>
  );
}
