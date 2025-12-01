import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faCalendarAlt, faAward, faStar } from "@fortawesome/free-solid-svg-icons";

// This component displays your "education" history with timeline
export default function EducationSection({ education }) {
  if (!education || education.length === 0) {
    return null;
  }

  return (
    <section className="group">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-4">
          <FontAwesomeIcon icon={faAward} className="w-4 h-4" />
          Academic Background
        </span>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Education
        </h2>
      </div>
      
      {/* Timeline container */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-orange-500 to-amber-500/20 hidden md:block"></div>
        
        <div className="space-y-8">
          {education.map((edu, index) => (
            <div 
              key={edu._id} 
              className="relative md:pl-16 group/item"
            >
              {/* Timeline dot */}
              <div className="absolute left-4 top-8 w-5 h-5 bg-slate-950 border-4 border-amber-500 rounded-full shadow-lg shadow-amber-500/20 hidden md:flex items-center justify-center group-hover/item:scale-125 transition-transform duration-300">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-700/50 hover:border-amber-500/30 transition-all duration-500 group-hover/item:-translate-y-1">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover/item:text-amber-400 transition-colors duration-300">
                      {edu.degree}
                    </h3>
                    <p className="text-slate-400 font-medium flex items-center gap-2 mt-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="w-4 h-4 text-amber-500" />
                      {edu.school}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 flex-shrink-0">
                    {edu.cgpa && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                        <FontAwesomeIcon icon={faStar} className="w-3.5 h-3.5" />
                        CGPA: {edu.cgpa}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
                      <FontAwesomeIcon icon={faCalendarAlt} className="w-3.5 h-3.5" />
                      {edu.start} – {edu.end}
                    </span>
                  </div>
                </div>
                {edu.description && (
                  <p className="text-slate-400 leading-relaxed mt-4 pl-4 border-l-2 border-amber-500/30">
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}