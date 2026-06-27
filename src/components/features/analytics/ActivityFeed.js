import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

// Recent visitor sessions: who came from where, and what they did
export default function ActivityFeed({ sessions }) {
  return (
    <div className="glass glass-hover rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <FontAwesomeIcon icon={faClockRotateLeft} className="text-indigo-500" />
        Recent Visitor Activity
      </h2>
      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((s, index) => (
            <div key={index} className="border border-gray-200 dark:border-slate-800 rounded-xl p-4 hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {s.location ? `Visitor from ${s.location}` : 'Visitor'}
                  </span>
                  {s.isReturning && (
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">
                      returning
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-medium">
                    via {s.source}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded-full text-xs font-medium">
                    {s.device}
                  </span>
                </div>
                <span className="text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap">
                  {format(new Date(s.when), 'MMM d, h:mm a')}
                </span>
              </div>
              <p className="text-sm text-gray-650 dark:text-slate-300 capitalize">{s.actions.join(' → ')}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-slate-400">
          <FontAwesomeIcon icon={faClockRotateLeft} className="text-4xl mb-4 text-gray-300 dark:text-slate-600" />
          <p>No visitor activity recorded yet</p>
          <p className="text-sm mt-2">Activity appears here from your next real visitor onward — your own visits and bots are excluded</p>
        </div>
      )}
    </div>
  );
}
