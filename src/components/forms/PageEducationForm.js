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
      ...prev,
      { school: "", degree: "", start: "", end: "", description: "" },
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
        
        {/* Add New Button */}
        <button
          onClick={addNewEducation}
          type="button"
          className="text-blue-500 text-lg flex gap-2 items-center cursor-pointer mb-4 hover:text-blue-700 transition duration-200"
        >
          <FontAwesomeIcon className="bg-blue-500 text-white p-1 rounded-full aspect-square" icon={faPlus} />
          <span>Add new</span>
        </button>

        {/* Education Items List */}
        <div className="flex flex-col gap-4">
          {education.map((edu, idx) => (
            <div key={idx} className="p-4 bg-white/10 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                <input
                  value={edu.school}
                  onChange={(e) => updateEdu(idx, "school", e.target.value)}
                  placeholder="School / University"
                  aria-label={`School ${idx + 1}`}
                  className="w-full rounded shadow px-3 py-2 bg-white/5"
                />
                <input
                  value={edu.degree}
                  onChange={(e) => updateEdu(idx, "degree", e.target.value)}
                  placeholder="Degree / Major"
                  aria-label={`Degree ${idx + 1}`}
                  className="w-full rounded shadow px-3 py-2 bg-white/5"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                <input
                  value={edu.start}
                  onChange={(e) => updateEdu(idx, "start", e.target.value)}
                  placeholder="Start Year"
                  aria-label={`Start Year ${idx + 1}`}
                  className="w-full rounded shadow px-3 py-2 bg-white/5"
                />
                <input
                  value={edu.end}
                  onChange={(e) => updateEdu(idx, "end", e.target.value)}
                  placeholder="End Year"
                  aria-label={`End Year ${idx + 1}`}
                  className="w-full rounded shadow px-3 py-2 bg-white/5"
                />
              </div>

              <textarea
                value={edu.description}
                onChange={(e) => updateEdu(idx, "description", e.target.value)}
                placeholder="Achievements / Coursework / Notes"
                rows={3}
                aria-label={`Description ${idx + 1}`}
                className="w-full rounded shadow px-3 py-2 bg-white/5"
              />

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