import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faExternalLinkAlt, faRocket, faClock, faLaptopCode, faFolder } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { btoa } from "next/dist/compiled/@edge-runtime/primitives"; 

export default function ProjectSection({ projects, baseUrl, pageUri }) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="group">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 text-sm font-medium mb-4">
          <FontAwesomeIcon icon={faFolder} className="w-4 h-4" />
          My Work
        </span>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Featured Projects
        </h2>
      </div>
      
      <div className="grid gap-8">
        {projects.map((project, index) => (
          <div 
            key={project._id} 
            className="group/card relative"
          >
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover/card:opacity-30 blur-lg transition-all duration-500"></div>
            
            <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-rose-500/30 transition-all duration-500">
              {/* Project Header with gradient accent */}
              <div className="h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500"></div>
              
              <div className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-4 mb-5">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover/card:text-rose-400 transition-colors duration-300 flex items-center gap-3">
                      <span className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
                        <FontAwesomeIcon icon={faLaptopCode} className="w-5 h-5 text-rose-400" />
                      </span>
                      {project.title}
                    </h3>
                    {project.timeTaken && (
                      <p className="text-sm text-slate-500 mt-2 flex items-center gap-2 ml-13">
                        <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5" />
                        {project.timeTaken}
                      </p>
                    )}
                  </div>
                  {project.techStacks && (
                    <div className="flex flex-wrap gap-2">
                      {project.techStacks.split(',').map((tech, i) => (
                        <span 
                          key={i} 
                          className="text-xs font-semibold px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50 hover:border-rose-500/30 transition-colors"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Project Summary as bullet points */}
                <div className="text-slate-400 leading-relaxed">
                  {project.summary && project.summary.includes('\n') ? (
                    <ul className="space-y-2">
                      {project.summary.split('\n').filter(line => line.trim()).map((point, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-gradient-to-r from-rose-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-base">{point.replace(/^[-•*]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  ) : project.summary && project.summary.includes('. ') ? (
                    <ul className="space-y-2">
                      {project.summary.split('. ').filter(line => line.trim()).map((point, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-gradient-to-r from-rose-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-base">{point.trim()}{!point.endsWith('.') ? '.' : ''}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-lg">{project.summary}</p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-slate-700/50">
                  {project.githubLink && (
                    <Link
                      href={project.githubLink}
                      target="_blank"
                      ping={`${baseUrl}api/click?url=${btoa(project.githubLink)}&page=${pageUri}&clickType=project`}
                      className="group/btn inline-flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
                    >
                      <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
                      <span>View Code</span>
                    </Link>
                  )}
                  
                  {project.liveLink && (
                    <Link
                      href={project.liveLink}
                      target="_blank"
                      ping={`${baseUrl}api/click?url=${btoa(project.liveLink)}&page=${pageUri}&clickType=project`}
                      className="group/btn inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-rose-500/25"
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="w-4 h-4" />
                      <span>Live Demo</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}