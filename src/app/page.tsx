'use client'

import Image from "next/image";
import TypewriterText from "@/components/TypewriterText";
import ProjectReveal from "@/components/ProjectReveal";
import SkillsReveal from "@/components/SkillsReveal";
import ExperienceReveal from "@/components/ExperienceReveal";
import AchievementsReveal from "@/components/AchievementsReveal";
import MatrixBackground from "@/components/MatrixBackground";
import ThemeCommand from "@/components/ThemeCommand";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const { theme } = useTheme();

  const summary = `Full-stack developer with expertise in Python and Java. Currently pursuing B.Tech in AI & ML 
    while working as a Software Developer Intern. Passionate about building scalable applications 
    and exploring new technologies. Experienced in web development, database management, and 
    machine learning applications.`;

  const projects = [
    {
      name: "NextYou LMS",
      tech: "Django, PostgreSQL, JavaScript",
      link: "https://github.com/tejuiceB/nExtYouLms",
      description: "Learning Management System with features like authentication, course management, and real-time progress tracking. Improved learning engagement by 40%."
    },
    {
      name: "Playlist Converter",
      tech: "Java, Spring Boot, OAuth",
      link: "https://github.com/tejuiceB/PlaylistConverter.git",
      description: "Cross-platform playlist migration tool supporting Spotify and YouTube. Implements OAuth2 for secure authentication and automated playlist syncing."
    },
    {
      name: "Recycling Awareness Web App",
      tech: "ReactJS, Flask, TensorFlow",
      link: "https://github.com/tejuiceB/recycler",
      description: "AI-powered application for identifying recyclable materials. Achieved 92% classification accuracy using custom CNN model."
    }
  ];

  const skills = [
    { skill: "Python/Django", level: 90 },
    { skill: "Java/Spring", level: 85 },
    { skill: "JavaScript/React", level: 80 },
    { skill: "Database Management", level: 85 },
    { skill: "DevOps Tools", level: 75 }
  ];

  return (
    <div className={`min-h-screen font-mono relative theme-transition theme-bg text-white`}
         data-theme={theme}>
      <MatrixBackground />
      {/* Terminal Header */}
      <div className="sticky top-0 bg-[#1a1a1a] p-2 border-b border-[#333] z-10">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-gray-400 text-sm">tejas@portfolio ~ </span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-8 sm:p-12">
        {/* Command Prompt */}
        <div className="mb-12 flex items-center">
          <span className="theme-primary">PS</span>
          <span className="text-white mx-1">C:\Users\Tejas&gt;</span>
          <TypewriterText text="get-portfolio" delay={100} />
        </div>

        {/* Content sections */}
        <div className="space-y-8">
          {/* Theme Command Section */}
          <section className="border theme-border p-8 rounded-md theme-section-bg backdrop-blur-sm hover:border-[var(--theme-primary)] transition-colors duration-300">
            <h2 className="text-xl font-bold theme-primary mb-4">$ tejuiceShell</h2>
            <ThemeCommand />
          </section>

          {/* Header Section */}
          <section className="border theme-border p-8 rounded-md theme-section-bg backdrop-blur-sm hover:border-[var(--theme-primary)] transition-colors duration-300">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="relative w-36 h-36 rounded-lg overflow-hidden group">
                <Image
                  src="/images/sticker1.png"
                  alt="Tejas Bhurbhure"
                  width={144}
                  height={144}
                  className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 ease-in-out"
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold theme-primary mb-2">Tejas Diwakar Bhurbhure</h1>
                <p className="text-[#16C60C]">Location: Nagpur, Maharashtra, India - 440016</p>
                <p className="text-[#16C60C]">Contact: +91-9637385287 | tejasbhurbhure06@gmail.com</p>
                <div className="mt-4 flex gap-4">
                  <a href="https://linkedin.com/in/tejas-bhurbhure-b35b0b218" 
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-[#3B91F7] hover:underline">LinkedIn</a>
                  <a href="https://github.com/tejuiceB" 
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-[#3B91F7] hover:underline">GitHub</a>
                  <a href="https://leetcode.com/u/tejuice/" 
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-[#3B91F7] hover:underline">LeetCode</a>
                </div>
              </div>
            </div>
          </section>

          {/* Summary Section */}
          <section className="border theme-border p-8 rounded-md theme-section-bg backdrop-blur-sm hover:border-[var(--theme-primary)] transition-colors duration-300">
            <h2 className="text-xl font-bold theme-primary mb-4">$ get-summary</h2>
            <div className="text-[#16C60C] leading-relaxed">
              <TypewriterText text={summary} />
            </div>
          </section>

          {/* Grid sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Skills and Experience sections in grid */}
            <section className="border theme-border p-8 rounded-md theme-section-bg backdrop-blur-sm hover:border-[var(--theme-primary)] transition-colors duration-300">
              <h2 className="text-xl font-bold theme-primary mb-6 flex items-center gap-2">
                <span className="text-gray-400">$</span> get-skills
              </h2>
              <SkillsReveal skills={skills} />
            </section>

            <section className="border theme-border p-8 rounded-md theme-section-bg backdrop-blur-sm hover:border-[var(--theme-primary)] transition-colors duration-300">
              <h2 className="text-xl font-bold theme-primary mb-4">$ get-experience</h2>
              <ExperienceReveal />
            </section>
          </div>

          {/* Projects Section - Full width */}
          <section className="border theme-border p-8 rounded-md theme-section-bg backdrop-blur-sm hover:border-[var(--theme-primary)] transition-colors duration-300">
            <h2 className="text-xl font-bold theme-primary mb-6 flex items-center gap-2">
              <span className="text-gray-400">$</span> get-projects
            </h2>
            <div className="space-y-4">
              <ProjectReveal projects={projects} />
            </div>
          </section>

          {/* Achievements Section - Full width */}
          <section className="border theme-border p-8 rounded-md theme-section-bg backdrop-blur-sm hover:border-[var(--theme-primary)] transition-colors duration-300">
            <h2 className="text-xl font-bold theme-primary mb-4">$ get-achievements</h2>
            <AchievementsReveal />
          </section>

          {/* Education Section - Full width */}
          <section className="border theme-border p-8 rounded-md theme-section-bg backdrop-blur-sm hover:border-[var(--theme-primary)] transition-colors duration-300">
            <h2 className="text-xl font-bold theme-primary mb-4">$ get-education</h2>
            <div className="space-y-4">
              <TypewriterText 
                text=">> Fetching educational background..." 
                delay={30} 
              />
              <div className="pl-4 border-l-2 border-[#16C60C] space-y-6 mt-4">
                <div className="terminal-entry group hover:bg-[#012456]/50 p-3 rounded transition-colors">
                  <p className="font-bold theme-primary">BTech in Computer Science (Artificial Intelligence and Machine Learning)</p>
                  <p className="text-[#16C60C]">YCCE, Nagpur</p>
                  <p className="text-sm text-gray-400">2022 - 2025</p>
                </div>
                <div className="terminal-entry group hover:bg-[#012456]/50 p-3 rounded transition-colors">
                  <p className="font-bold theme-primary">Diploma in Computer Engineering</p>
                  <p className="text-[#16C60C]">Government Polytechnic Amravati</p>
                  <p className="text-sm text-gray-400">2018 - 2022</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Terminal footer */}
        <footer className="mt-12 pt-6 border-t border-gray-600 text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Tejas Bhurbhure ~ Portfolio v1.0.0</p>
        </footer>
      </main>
    </div>
  );
}
