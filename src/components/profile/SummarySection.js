import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

// This component displays your "summary"
export default function SummarySection({ summary }) {
  if (!summary) {
    return null;
  }

  return (
    <section className="group">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-4">
          <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
          Introduction
        </span>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          About Me
        </h2>
      </div>
      
      <div className="relative">
        {/* Decorative gradient background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50"></div>
        
        <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-500">
          {/* Quote decoration */}
          <div className="absolute top-6 left-6 text-6xl text-blue-500/20 font-serif">&ldquo;</div>
          
          <p className="text-slate-300 leading-relaxed whitespace-pre-line text-lg md:text-xl pl-8 relative z-10">
            {summary}
          </p>
          
          <div className="absolute bottom-6 right-8 text-6xl text-blue-500/20 font-serif">&rdquo;</div>
        </div>
      </div>
    </section>
  );
}