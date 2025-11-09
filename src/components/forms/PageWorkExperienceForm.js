"use client";
import { useState } from "react";
import SectionBox from "../layout/SectionBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines, faLink, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import SubmitButton from "../buttons/SubmitButton";

import { savePageWorkExperience } from "@/actions/pageActions";
import { toast } from 'react-hot-toast';

// The component now receives 'initialWorkExperience'
export default function PageWorkExperienceForm({ page, user, initialWorkExperience }) {
  // Use the new prop to set the initial state
  const initial = (initialWorkExperience || []).map((w, i) => ({ ...w, id: w._id || `w-${i}-${Date.now()}` }));
  const [items, setItems] = useState(initial);
  const [isSaving, setIsSaving] = useState(false); // Renamed from 'message' for clarity

  function addNewWork() {
    setItems(prev => [...prev, {
      id: `w-${Date.now()}`,
      company: "",
      role: "",
      start: "",
      end: "",
      bullets: []
    }]);
  }

  function updateItem(idx, patch) {
    setItems(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  }

  function removeItem(idx) {
    setItems(prev => prev.filter((_, i) => i !== idx));
  }

  function setBullets(idx, text) {
    const bullets = text.split("\n").map(s => s.trim()).filter(Boolean);
    updateItem(idx, { bullets });
  }

  // Save function to call the server action
  async function save(ev) {
    ev.preventDefault();
    setIsSaving(true);
    // Send the URI and the current items state
    const result = await savePageWorkExperience(page.uri, items);
    setIsSaving(false);
    if (result.success) {
      toast.success('Work experience saved!');
    } else {
      toast.error(`Error: ${result.message || 'Could not save.'}`);
    }
  }

  return (
    <SectionBox> 
      {/* Add the onSubmit handler */}
      <form onSubmit={save}>
        <h2 className="text-2xl font-bold mb-4 text-center">Work Experience</h2>
        <button
          onClick={addNewWork}
          type="button"
          className="text-blue-500 text-lg flex gap-2 items-center cursor-pointer mb-4 hover:text-blue-700 transition duration-200">
          <FontAwesomeIcon className="bg-blue-500 text-white p-1 rounded-full aspect-square" icon={faPlus} />
          <span>Add new</span>
        </button>

        <div className="space-y-4">
          {items.length === 0 && (
            // Using your light theme classes
            <div className="text-sm text-gray-500">No work entries yet — click “Add new” to start.</div>
          )}

          {items.map((it, idx) => (
            <div key={it.id} className="p-4 bg-gray-100 rounded-lg"> {/* Light theme bg */}
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <input
                    value={it.company}
                    onChange={(e) => updateItem(idx, { company: e.target.value })}
                    placeholder="Company (e.g., Acme Inc.)"
                    className="w-full mb-2 rounded shadow-sm px-3 py-2 border border-gray-300 bg-gray-50"
                  />
                  <input
                    value={it.role}
                    onChange={(e) => updateItem(idx, { role: e.target.value })}
                    placeholder="Role (e.g., Frontend Engineer)"
                    className="w-full mb-2 rounded shadow-sm px-3 py-2 border border-gray-300 bg-gray-50"
                  />
                  <div className="flex gap-2 mb-2">
                    <input
                      value={it.start}
                      onChange={(e) => updateItem(idx, { start: e.target.value })}
                      placeholder="Start (e.g., Jan 2022)"
                      className="rounded px-3 py-2 shadow-sm border border-gray-300 bg-gray-50 flex-1"
                    />
                    <input
                      value={it.end}
                      onChange={(e) => updateItem(idx, { end: e.target.value })}
                      placeholder="End (e.g., Present)"
                      className="rounded px-3 py-2 shadow-sm border border-gray-300 bg-gray-50 w-40"
                    />
                  </div>

                  <label className="text-sm text-gray-600">Bullets (one per line)</label>
                  <textarea
                    rows={4}
                    value={(it.bullets || []).join("\n")}
                    onChange={(e) => setBullets(idx, e.target.value)}
                    placeholder={"• Built X\n• Improved Y by 30%"}
                    className="w-full mt-1 rounded shadow-sm px-3 py-2 border border-gray-300 bg-gray-50"
                  />
                </div>

                <div className="flex flex-col gap-2 ml-2">
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="w-full bg-red-500 text-white py-2 px-3 h-full flex gap-2 items-center justify-center rounded shadow hover:bg-red-600 transition duration-200">
                    <FontAwesomeIcon icon={faTrash} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4 mt-4">
          <SubmitButton 
            disabled={isSaving}
            className="max-w-xs mx-auto bg-blue-500 hover:bg-blue-600 transition duration-200">
            <FontAwesomeIcon icon={faSave} />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </SubmitButton>
        </div>
      </form>
    </SectionBox>
  );
}