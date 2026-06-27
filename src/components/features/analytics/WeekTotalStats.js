const styles = {
  indigo: { box: 'bg-indigo-50 dark:bg-indigo-950/40 rounded-xl', value: 'text-indigo-600 dark:text-indigo-400', label: 'text-indigo-500 dark:text-indigo-400', grayBox: 'bg-gray-50 dark:bg-slate-800/40 rounded-xl', grayLabel: 'text-gray-500 dark:text-slate-400' },
  blue: { box: 'bg-blue-50 dark:bg-blue-950/40 rounded-lg', value: 'text-blue-600 dark:text-blue-400', label: 'text-blue-600 dark:text-blue-400', grayBox: 'bg-gray-50 dark:bg-slate-800/40 rounded-lg', grayLabel: 'text-gray-600 dark:text-slate-400' },
};

// The "7 days / Total" stat-box pair used in the per-link and per-social rows
export default function WeekTotalStats({ week, total, color = 'indigo' }) {
  const style = styles[color] || styles.indigo;
  return (
    <div className="flex gap-4">
      <div className={`text-center p-3 ${style.box} min-w-[80px]`}>
        <div className={`text-xl font-bold ${style.value}`}>{week}</div>
        <div className={`text-xs ${style.label} font-medium`}>7 days</div>
      </div>
      <div className={`text-center p-3 ${style.grayBox} min-w-[80px]`}>
        <div className="text-xl font-bold text-gray-900 dark:text-white">{total}</div>
        <div className={`text-xs ${style.grayLabel} font-medium`}>Total</div>
      </div>
    </div>
  );
}
