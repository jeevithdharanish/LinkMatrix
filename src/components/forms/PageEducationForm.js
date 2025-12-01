'use client';

import { useState } from "react";
import { savePageEducation } from "@/actions/pageActions"; // Make sure path is correct
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import SectionBox from "@/components/layout/SectionBox";
import SubmitButton from "../buttons/SubmitButton";

export default function PageEducationForm({ page, initialEducation }) {
  // Use the passed-in initialEducation to set the state
  const [education, setEducation] = useState(initialEducation || []);
  const [isSaving, setIsSaving] = useState(false);
  
  async function save(ev) {
    ev.preventDefault();
    setIsSaving(true);
    
    // The server action now handles saving this array to the separate collection
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
      { school: "", degree: "", start: "", end: "", cgpa: "", description: "" },
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
        <h2 className="text-2xl font-bold mb-4 text-center">Education</h2>
        
        {/* Add New Button - At Top */}
        <button
          onClick={addNewEducation}
          type="button"
          className="text-blue-500 text-lg flex gap-2 items-center cursor-pointer mb-4 hover:text-blue-700 transition duration-200"
        >
          <FontAwesomeIcon className="bg-blue-500 text-white p-1 rounded-full aspect-square" icon={faPlus} />
          <span>Add new education</span>
        </button>
        
        {/* Education Items List */}
        <div className="space-y-4">
          {education.length === 0 && (
            <div className="text-sm text-gray-400">No education added yet.</div>
          )}

          {education.map((edu, idx) => (
            <div key={idx} className="p-4 bg-white/10 rounded-lg">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">School / University</label>
                <input
                  value={edu.school}
                  onChange={(e) => updateEdu(idx, "school", e.target.value)}
                  placeholder="e.g., MIT, Stanford University"
                  className="w-full rounded shadow px-3 py-2 bg-white/5 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">Degree / Major</label>
                <input
                  value={edu.degree}
                  onChange={(e) => updateEdu(idx, "degree", e.target.value)}
                  placeholder="e.g., B.Tech in Computer Science"
                  className="w-full rounded shadow px-3 py-2 bg-white/5 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Start Year</label>
                  <input
                    value={edu.start}
                    onChange={(e) => updateEdu(idx, "start", e.target.value)}
                    placeholder="e.g., 2020"
                    className="w-full rounded shadow px-3 py-2 bg-white/5 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">End Year</label>
                  <input
                    value={edu.end}
                    onChange={(e) => updateEdu(idx, "end", e.target.value)}
                    placeholder="e.g., 2024 or Present"
                    className="w-full rounded shadow px-3 py-2 bg-white/5 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">CGPA / GPA</label>
                  <input
                    value={edu.cgpa || ''}
                    onChange={(e) => updateEdu(idx, "cgpa", e.target.value)}
                    placeholder="e.g., 8.5/10 or 3.8/4.0"
                    className="w-full rounded shadow px-3 py-2 bg-white/5 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Description / Achievements</label>
                <textarea
                  value={edu.description}
                  onChange={(e) => updateEdu(idx, "description", e.target.value)}
                  placeholder="Relevant coursework, achievements, honors, activities..."
                  rows={4}
                  className="w-full rounded shadow px-3 py-2 bg-white/5 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="text-right mt-2">
                <button
                  onClick={() => removeEdu(idx)}
                  type="button"
                  className="bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600 transition duration-200"
                >
                  <FontAwesomeIcon icon={faTrash} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="border-t pt-4 mt-4">
          <SubmitButton 
            disabled={isSaving} 
            className="max-w-xs mx-auto bg-blue-500 hover:bg-blue-600 transition duration-200">
            <FontAwesomeIcon icon={faSave} />
            <span className="ml-2">{isSaving ? "Saving..." : "Save"}</span>
          </SubmitButton>
        </div>
      </form>
    </SectionBox>
  );
}