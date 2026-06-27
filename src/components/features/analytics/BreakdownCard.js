import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const barColors = {
  indigo: 'bg-indigo-500',
  rose: 'bg-rose-400',
  emerald: 'bg-emerald-400',
};

const iconColors = {
  indigo: 'text-indigo-500',
  rose: 'text-rose-500',
  emerald: 'text-emerald-500',
};

// Ranked list with counts and proportional bars (traffic sources, locations, devices)
export default function BreakdownCard({ title, subtitle, icon, color, items, total, limit = 6, emptyText }) {
  return (
    <div className="glass glass-hover rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <FontAwesomeIcon icon={icon} className={iconColors[color] || iconColors.indigo} />
        {title}
      </h2>
      <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 mb-4">{subtitle}</p>
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.slice(0, limit).map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="flex-1 text-sm text-gray-700 dark:text-slate-350 truncate">{item.label}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.count}</span>
              <div className="w-20 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${barColors[color] || barColors.indigo}`}
                  style={{ width: `${Math.max((item.count / (total || 1)) * 100, 4)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-slate-500 py-6 text-center">{emptyText}</p>
      )}
    </div>
  );
}
