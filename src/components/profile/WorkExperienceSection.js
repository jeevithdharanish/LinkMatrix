import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faCalendarAlt, faBuilding, faCheckCircle, faRocket } from "@fortawesome/free-solid-svg-icons";

// This component displays your "work" history with timeline
export default function WorkExperienceSection({ workExperience }) {
  if (!workExperience || workExperience.length === 0) {
    return null;
  }

  return (
    <section className="group">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-medium mb-4">
          <FontAwesomeIcon icon={faRocket} className="w-4 h-4" />
          Career Journey
        </span>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Work Experience
        </h2>
      </div>
      
      {/* Timeline container */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-indigo-500 to-purple-500/20 hidden md:block"></div>
        
        <div className="space-y-8">
          {workExperience.map((work, index) => (
            <div 
              key={work._id} 
              className="relative md:pl-16 group/item"
            >
              {/* Timeline dot */}
              <div className="absolute left-4 top-8 w-5 h-5 bg-slate-950 border-4 border-purple-500 rounded-full shadow-lg shadow-purple-500/20 hidden md:flex items-center justify-center group-hover/item:scale-125 transition-transform duration-300">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-500 group-hover/item:-translate-y-1">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover/item:text-purple-400 transition-colors duration-300">
                      {work.role}
                    </h3>
                    <p className="text-slate-400 font-medium flex items-center gap-2 mt-2">
                      <FontAwesomeIcon icon={faBuilding} className="w-4 h-4 text-purple-500" />
                      {work.company}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-sm font-medium flex-shrink-0">
                    <FontAwesomeIcon icon={faCalendarAlt} className="w-3.5 h-3.5" />
                    {work.start} – {work.end}
                  </span>
                </div>
                {work.bullets && work.bullets.length > 0 && (
                  <ul className="space-y-3 mt-5">
                    {work.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-400">
                        <FontAwesomeIcon 
                          icon={faCheckCircle} 
                          className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" 
                        />
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}