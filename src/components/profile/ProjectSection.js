import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { btoa } from "next/dist/compiled/@edge-runtime/primitives"; 

// 1. Accept the new props: baseUrl and pageUri
export default function ProjectSection({ projects, baseUrl, pageUri }) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                <p className="text-sm text-gray-500 mb-2 sm:mb-0">{project.timeTaken}</p>
              </div>
              <span className="text-sm text-blue-800 bg-blue-100 rounded-full px-3 py-1 font-medium flex-shrink-0">
                {project.techStacks}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed mt-3">
              {project.summary}
            </p>

            <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200">
              {/* GitHub Link with Tracking */}
              {project.githubLink && (
                <Link
                  href={project.githubLink}
                  target="_blank"
                  // 2. Add ping attribute with clickType=project
                  ping={`${baseUrl}api/click?url=${btoa(project.githubLink)}&page=${pageUri}&clickType=project`}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
                  <span className="text-sm font-medium">View Code</span>
                </Link>
              )}
              
              {/* Live Link with Tracking */}
              {project.liveLink && (
                <Link
                  href={project.liveLink}
                  target="_blank"
                  // 3. Add ping attribute with clickType=project
                  ping={`${baseUrl}api/click?url=${btoa(project.liveLink)}&page=${pageUri}&clickType=project`}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="w-4 h-4" />
                  <span className="text-sm font-medium">Live Demo</span>
                </Link>
              )}
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
}