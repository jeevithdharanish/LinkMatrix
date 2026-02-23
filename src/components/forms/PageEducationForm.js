'use client';

import { useState } from "react";
import { savePageEducation } from "@/actions/pageActions";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import SectionBox from "@/components/layout/SectionBox";
import SubmitButton from "../buttons/SubmitButton";

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
        <h2 className="text-xl font-semibold mb-5 text-gray-900">Education</h2>

        {/* Add New Button - At Top */}
        <button
          onClick={addNewEducation}
          type="button"
          className="text-indigo-600 text-sm flex gap-2 items-center cursor-pointer mb-4 hover:text-indigo-700 transition duration-200 font-medium"
        >
          <div className="w-6 h-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
          </div>
          <span>Add new education</span>
        </button>

        {/* Education Items List */}
        <div className="space-y-3">
          {education.length === 0 && (
            <div className="text-sm text-gray-400 text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              No education added yet.
            </div>
          )}

          {education.map((edu, idx) => (
            <div key={edu._clientId} className="p-4 bg-gray-50/50 rounded-xl border border-gray-200 hover:border-indigo-200 transition-all duration-200">
              <div className="mb-3">
                <label htmlFor={`school-${edu._clientId}`} className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">School / University</label>
                <input
                  id={`school-${edu._clientId}`}
                  value={edu.school || ''}
                  onChange={(e) => updateEdu(idx, "school", e.target.value)}
                  placeholder="e.g., MIT, Stanford University"
                  className="w-full rounded-xl px-3 py-2.5 bg-white border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="mb-3">
                <label htmlFor={`degree-${edu._clientId}`} className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Degree / Major</label>
                <input
                  id={`degree-${edu._clientId}`}
                  value={edu.degree || ''}
                  onChange={(e) => updateEdu(idx, "degree", e.target.value)}
                  placeholder="e.g., B.Tech in Computer Science"
                  className="w-full rounded-xl px-3 py-2.5 bg-white border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label htmlFor={`start-${edu._clientId}`} className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Start Year</label>
                  <input
                    id={`start-${edu._clientId}`}
                    value={edu.start || ''}
                    onChange={(e) => updateEdu(idx, "start", e.target.value)}
                    placeholder="e.g., 2020"
                    className="w-full rounded-xl px-3 py-2.5 bg-white border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor={`end-${edu._clientId}`} className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">End Year</label>
                  <input
                    id={`end-${edu._clientId}`}
                    value={edu.end || ''}
                    onChange={(e) => updateEdu(idx, "end", e.target.value)}
                    placeholder="e.g., 2024 or Present"
                    className="w-full rounded-xl px-3 py-2.5 bg-white border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor={`cgpa-${edu._clientId}`} className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">CGPA / GPA</label>
                  <input
                    id={`cgpa-${edu._clientId}`}
                    value={edu.cgpa || ''}
                    onChange={(e) => updateEdu(idx, "cgpa", e.target.value)}
                    placeholder="e.g., 8.5/10"
                    className="w-full rounded-xl px-3 py-2.5 bg-white border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="mb-2">
                <label htmlFor={`desc-${edu._clientId}`} className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Description / Achievements</label>
                <textarea
                  id={`desc-${edu._clientId}`}
                  value={edu.description || ''}
                  onChange={(e) => updateEdu(idx, "description", e.target.value)}
                  placeholder="Relevant coursework, achievements, honors, activities..."
                  rows={3}
                  className="w-full rounded-xl px-3 py-2.5 bg-white border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                />
              </div>

              <div className="text-right mt-2">
                <button
                  onClick={() => removeEdu(idx)}
                  type="button"
                  aria-label={`Remove ${edu.school || 'this'} education entry`}
                  className="bg-red-50 text-red-500 py-1.5 px-3 rounded-xl text-xs font-medium hover:bg-red-100 transition duration-200"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="border-t border-gray-100 pt-4 mt-4">
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