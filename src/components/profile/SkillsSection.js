"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptopCode, faCode, faServer, faTools, faGraduationCap, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

// Skill categories with icons
const categoryConfig = {
  "Programming Languages": { icon: faCode, color: "from-purple-500 to-indigo-500", showProgress: true },
  "Frontend Development": { icon: faLaptopCode, color: "from-emerald-500 to-teal-500", showProgress: true },
  "Backend Development": { icon: faServer, color: "from-blue-500 to-cyan-500", showProgress: true },
  "Tools & Technologies": { icon: faTools, color: "from-orange-500 to-amber-500", showProgress: true },
  "Related Coursework": { icon: faGraduationCap, color: "from-pink-500 to-rose-500", showProgress: false },
  "Other Coursework": { icon: faBookOpen, color: "from-violet-500 to-purple-500", showProgress: false },
};

// Skill icons mapping (you can add more)
const skillIcons = {
  // Programming Languages
  "Python": "/skills/python.svg",
  "JavaScript": "/skills/javascript.svg",
  "TypeScript": "/skills/typescript.svg",
  "Java": "/skills/java.svg",
  "C++": "/skills/cpp.svg",
  "C": "/skills/c.svg",
  "Go": "/skills/go.svg",
  "Rust": "/skills/rust.svg",
  
  // Frontend
  "React": "/skills/react.svg",
  "Next.js": "/skills/nextjs.svg",
  "Vue.js": "/skills/vue.svg",
  "Angular": "/skills/angular.svg",
  "HTML": "/skills/html.svg",
  "CSS": "/skills/css.svg",
  "Tailwind CSS": "/skills/tailwind.svg",
  "Bootstrap": "/skills/bootstrap.svg",
  "SASS": "/skills/sass.svg",
  
  // Backend
  "Node.js": "/skills/nodejs.svg",
  "Express.js": "/skills/express.svg",
  "Django": "/skills/django.svg",
  "Flask": "/skills/flask.svg",
  "Spring Boot": "/skills/spring.svg",
  "FastAPI": "/skills/fastapi.svg",
  "GraphQL": "/skills/graphql.svg",
  
  // Tools
  "Git": "/skills/git.svg",
  "Docker": "/skills/docker.svg",
  "AWS": "/skills/aws.svg",
  "MongoDB": "/skills/mongodb.svg",
  "PostgreSQL": "/skills/postgresql.svg",
  "MySQL": "/skills/mysql.svg",
  "Redis": "/skills/redis.svg",
  "Firebase": "/skills/firebase.svg",
  "Linux": "/skills/linux.svg",
  "VS Code": "/skills/vscode.svg",
};

// This component displays your "skills" with categories and proficiency
export default function SkillsSection({ skills }) {
  const [activeCategory, setActiveCategory] = useState(null);

  // If skills is an array of strings (old format), convert to new format
  // If skills is already categorized object, use it directly
  let categorizedSkills = {};
  
  if (Array.isArray(skills)) {
    // Old format: just an array of skill names
    // We'll put them all in a default category
    categorizedSkills = {
      "All Skills": skills.map(skill => ({ name: skill, proficiency: 80 }))
    };
  } else if (skills && typeof skills === 'object') {
    // New format: { category: [{ name, proficiency }] }
    categorizedSkills = skills;
  }

  const categories = Object.keys(categorizedSkills);
  
  if (categories.length === 0) {
    return null;
  }

  // Set default active category
  if (activeCategory === null && categories.length > 0) {
    setActiveCategory(categories[0]);
  }

  const currentSkills = categorizedSkills[activeCategory] || [];

  return (
    <section className="group">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-4">
          <FontAwesomeIcon icon={faLaptopCode} className="w-4 h-4" />
          Tech Stack
        </span>
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-white">My </span>
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Skills</span>
        </h2>
        <p className="text-slate-400 mt-4 text-lg">
          Technologies and tools I use to bring ideas to life
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((category) => {
          const config = categoryConfig[category] || { icon: faCode, color: "from-blue-500 to-purple-500" };
          const isActive = activeCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                isActive
                  ? `bg-gradient-to-r ${config.color} text-white shadow-lg scale-105`
                  : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600 hover:text-white"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Active Category Title */}
      <h3 className="text-xl font-bold text-white text-center mb-8">
        {activeCategory}
      </h3>

      {/* Skills Grid */}
      {(() => {
        const config = categoryConfig[activeCategory] || { showProgress: true };
        const showProgress = config.showProgress !== false;
        
        // For Related Coursework, show as tags/chips instead of cards
        if (!showProgress) {
          return (
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {currentSkills.map((skill, index) => {
                const skillName = typeof skill === 'string' ? skill : skill.name;
                return (
                  <span
                    key={skillName}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-pink-500/30 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-800"
                  >
                    <FontAwesomeIcon icon={faBookOpen} className="w-4 h-4 text-pink-400" />
                    <span className="text-white font-medium">{skillName}</span>
                  </span>
                );
              })}
            </div>
          );
        }
        
        // Regular skills with progress bars
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {currentSkills.map((skill, index) => {
              const skillName = typeof skill === 'string' ? skill : skill.name;
              const proficiency = typeof skill === 'object' ? skill.proficiency : 80;
              const iconPath = skillIcons[skillName];
              
              return (
                <div
                  key={skillName}
                  className="group/card bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {/* Skill Icon */}
                    <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center overflow-hidden">
                      {iconPath ? (
                        <Image
                          src={iconPath}
                          alt={skillName}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-emerald-400">
                          {skillName.charAt(0)}
                        </span>
                      )}
                    </div>
                    
                    {/* Skill Info */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-lg">{skillName}</h4>
                      <p className="text-slate-400 text-sm">{proficiency}% Proficiency</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${proficiency}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}
    </section>
  );
}