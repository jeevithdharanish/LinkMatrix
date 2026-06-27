'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FormHeader({ title, description, icon }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shadow-sm">
        <FontAwesomeIcon icon={icon} className="text-lg" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {description && (
          <p className="text-gray-500 dark:text-slate-400 text-xs mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}
