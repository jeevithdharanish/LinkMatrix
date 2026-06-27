'use client';

import { useState } from "react";
import { savePageEducation } from "@/actions/pageActions";
import { toast } from "react-hot-toast";
import { faPlus, faSave, faTrash, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import SectionBox from "@/components/layout/SectionBox";
import SubmitButton from "@/components/ui/SubmitButton";
import FormHeader from "@/components/ui/FormHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Client-only id for React keys on entries that aren't saved yet (no _id from Mongo).
// The counter keeps ids unique even when several entries are added in the same millisecond.
let nextId = 1;
function generateId() {
  return `edu_${Date.now()}_${nextId++}`;
}

export default function PageEducationForm({ page, initialEducation }) {
  const [education, setEducation] = useState(() =>
    (initialEducation || []).map(edu => ({
      ...edu,
      _clientId: edu._id || generateId(),
    }))
  );
  const [isSaving, setIsSaving] = useState(false);

  async function save(ev) {
    ev.preventDefault();
    setIsSaving(true);

    const result = await savePageEducation(page.uri, education);

    if (result.success) {
      toast.success('Saved!');
    } else {
      toast.error(`Error: ${result.message || 'Could not save.'}`);
    }

    setIsSaving(false);
  }

  function addNewEducation() {
    setEducation(prev => [
      { _clientId: generateId(), school: "", degree: "", start: "", end: "", cgpa: "", description: "" },
      ...prev,
    ]);
  }

  function updateEdu(idx, field, value) {
    setEducation(prev => {
      const newEducation = [...prev];
      newEducation[idx] = { ...newEducation[idx], [field]: value };
      return newEducation;
    });
  }

  function removeEdu(idx) {
    setEducation(prev => prev.filter((_, i) => i !== idx));
  }

  return (
    <SectionBox>
      <form onSubmit={save}>
        <FormHeader title="Education" description="Add your academic background, degrees, and institutions" icon={faGraduationCap} />

        {/* Add New Button - At Top */}
        <button
          onClick={addNewEducation}
          type="button"
          className="btn-dashed-add mb-4"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Add new education</span>
        </button>

        {/* Education Items List */}
        <div className="space-y-3">
          {education.length === 0 && (
            <div className="text-sm text-gray-400 dark:text-slate-500 text-center py-6 bg-gray-50 dark:bg-slate-850 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
              No education added yet.
            </div>
          )}

          {education.map((edu, idx) => (
            <div key={edu._clientId} className="p-4 bg-gray-50/50 dark:bg-slate-850/50 rounded-xl border border-gray-200 dark:border-slate-750 hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all duration-200">
              <div className="mb-3">
                <label htmlFor={`school-${edu._clientId}`} className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 uppercase tracking-wider">School / University</label>
                <input
                  id={`school-${edu._clientId}`}
                  value={edu.school || ''}
                  onChange={(e) => updateEdu(idx, "school", e.target.value)}
                  placeholder="e.g., MIT, Stanford University"
                  className="w-full rounded-xl px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="mb-3">
                <label htmlFor={`degree-${edu._clientId}`} className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Degree / Major</label>
                <input
                  id={`degree-${edu._clientId}`}
                  value={edu.degree || ''}
                  onChange={(e) => updateEdu(idx, "degree", e.target.value)}
                  placeholder="e.g., B.Tech in Computer Science"
                  className="w-full rounded-xl px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label htmlFor={`start-${edu._clientId}`} className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Start Year</label>
                  <input
                    id={`start-${edu._clientId}`}
                    value={edu.start || ''}
                    onChange={(e) => updateEdu(idx, "start", e.target.value)}
                    placeholder="e.g., 2020"
                    className="w-full rounded-xl px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor={`end-${edu._clientId}`} className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 uppercase tracking-wider">End Year</label>
                  <input
                    id={`end-${edu._clientId}`}
                    value={edu.end || ''}
                    onChange={(e) => updateEdu(idx, "end", e.target.value)}
                    placeholder="e.g., 2024 or Present"
                    className="w-full rounded-xl px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor={`cgpa-${edu._clientId}`} className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 uppercase tracking-wider">CGPA / GPA</label>
                  <input
                    id={`cgpa-${edu._clientId}`}
                    value={edu.cgpa || ''}
                    onChange={(e) => updateEdu(idx, "cgpa", e.target.value)}
                    placeholder="e.g., 8.5/10"
                    className="w-full rounded-xl px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="mb-2">
                <label htmlFor={`desc-${edu._clientId}`} className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Description / Achievements</label>
                <textarea
                  id={`desc-${edu._clientId}`}
                  value={edu.description || ''}
                  onChange={(e) => updateEdu(idx, "description", e.target.value)}
                  placeholder="Relevant coursework, achievements, honors, activities..."
                  rows={3}
                  className="w-full rounded-xl px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                />
              </div>

              <div className="text-right mt-2">
                <button
                  onClick={() => removeEdu(idx)}
                  type="button"
                  aria-label={`Remove ${edu.school || 'this'} education entry`}
                  className="bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 py-1.5 px-3 rounded-xl text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition duration-200"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="border-t border-gray-100 dark:border-slate-800 pt-4 mt-4">
          <SubmitButton
            disabled={isSaving}
            className="max-w-xs mx-auto">
            <FontAwesomeIcon icon={faSave} />
            <span className="ml-1">{isSaving ? "Saving..." : "Save"}</span>
          </SubmitButton>
        </div>
      </form>
    </SectionBox>
  );
}