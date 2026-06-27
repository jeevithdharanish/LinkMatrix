import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

// Tailwind needs full literal class names, so each color variant is spelled out
const colorStyles = {
  emerald: { hover: 'hover:border-emerald-200 dark:hover:border-emerald-800/40', sub: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-950/30', icon: 'text-emerald-600 dark:text-emerald-400' },
  blue: { hover: 'hover:border-blue-200 dark:hover:border-blue-800/40', sub: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-100 dark:bg-blue-950/30', icon: 'text-blue-600 dark:text-blue-400' },
  purple: { hover: 'hover:border-purple-200 dark:hover:border-purple-800/40', sub: 'text-purple-600 dark:text-purple-400', iconBg: 'bg-purple-100 dark:bg-purple-950/30', icon: 'text-purple-600 dark:text-purple-400' },
  rose: { hover: 'hover:border-rose-200 dark:hover:border-rose-800/40', sub: 'text-rose-600 dark:text-rose-400', iconBg: 'bg-rose-100 dark:bg-rose-950/30', icon: 'text-rose-600 dark:text-rose-400' },
  amber: { hover: 'hover:border-amber-200 dark:hover:border-amber-800/40', sub: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-950/30', icon: 'text-amber-600 dark:text-amber-400' },
};

function TrendBadge({ current, previous }) {
  if (current === 0 && previous === 0) {
    return <span className="text-xs text-gray-400 dark:text-slate-500 mt-1 block">no activity this week</span>;
  }
  const change = previous > 0
    ? Math.round(((current - previous) / previous) * 100)
    : 100;
  const up = change >= 0;
  return (
    <span className={`text-xs mt-1 flex items-center ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
      <FontAwesomeIcon icon={up ? faArrowUp : faArrowDown} className="mr-1" />
      {Math.abs(change)}% vs last week
    </span>
  );
}

// Summary card: headline number, "today" sub-line, optional week-over-week
// trend badge or free-text note under it.
export default function StatCard({ label, value, today, icon, color, trend, note }) {
  const style = colorStyles[color] || colorStyles.blue;
  return (
    <div className={`glass glass-hover rounded-2xl p-6 ${style.hover}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className={`text-xs ${style.sub} mt-1 flex items-center`}>
            <FontAwesomeIcon icon={faCalendarDay} className="mr-1" />
            {today}
          </p>
          {trend && <TrendBadge current={trend.current} previous={trend.previous} />}
          {note && <span className="text-xs text-gray-400 dark:text-slate-500 mt-1 block">{note}</span>}
        </div>
        <div className={`p-3 ${style.iconBg} rounded-xl`}>
          <FontAwesomeIcon icon={icon} className={`text-xl ${style.icon}`} />
        </div>
      </div>
    </div>
  );
}
