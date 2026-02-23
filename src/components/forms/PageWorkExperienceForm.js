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
  const [isSaving, setIsSaving] = useState(false);

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
      <form onSubmit={save}>
        <h2 className="text-xl font-semibold mb-5 text-gray-900">Work Experience</h2>
        <div className="space-y-3">
          {items.length === 0 && (
            <div className="text-sm text-gray-400 text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              No work entries yet — click &ldquo;Add new&rdquo; to start.
            </div>
          )}

          {items.map((it, idx) => (
            <div key={it.id} className="p-4 bg-gray-50/50 rounded-xl border border-gray-200 hover:border-indigo-200 transition-all duration-200">
              <div className="flex gap-3 items-start">
                <div className="flex-1 space-y-2">
                  <input
                    value={it.company}
                    onChange={(e) => updateItem(idx, { company: e.target.value })}
                    placeholder="Company (e.g., Acme Inc.)"
                    className="w-full rounded-xl px-3 py-2.5 border border-gray-200 bg-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <input
                    value={it.role}
                    onChange={(e) => updateItem(idx, { role: e.target.value })}
                    placeholder="Role (e.g., Frontend Engineer)"
                    className="w-full rounded-xl px-3 py-2.5 border border-gray-200 bg-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <div className="flex gap-2">
                    <input
                      value={it.start}
                      onChange={(e) => updateItem(idx, { start: e.target.value })}
                      placeholder="Start (e.g., Jan 2022)"
                      className="rounded-xl px-3 py-2.5 border border-gray-200 bg-white flex-1 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                    <input
                      value={it.end}
                      onChange={(e) => updateItem(idx, { end: e.target.value })}
                      placeholder="End (e.g., Present)"
                      className="rounded-xl px-3 py-2.5 border border-gray-200 bg-white w-40 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Bullet Points (one per line)</label>
                    <textarea
                      rows={3}
                      value={(it.bullets || []).join("\n")}
                      onChange={(e) => setBullets(idx, e.target.value)}
                      placeholder={"• Built X\n• Improved Y by 30%"}
                      className="w-full rounded-xl px-3 py-2.5 border border-gray-200 bg-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="bg-red-50 text-red-500 py-2 px-3 flex gap-1.5 items-center justify-center rounded-xl hover:bg-red-100 transition duration-200 text-xs font-medium flex-shrink-0">
                  <FontAwesomeIcon icon={faTrash} className="text-xs" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}

          {/* Add New Button */}
          <button
            onClick={addNewWork}
            type="button"
            className="text-indigo-600 text-sm flex gap-2 items-center cursor-pointer mt-2 hover:text-indigo-700 transition duration-200 font-medium">
            <div className="w-6 h-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
            </div>
            <span>Add new experience</span>
          </button>
        </div>

        <div className="border-t border-gray-100 pt-4 mt-4">
          <SubmitButton
            disabled={isSaving}
            className="max-w-xs mx-auto">
            <FontAwesomeIcon icon={faSave} />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </SubmitButton>
        </div>
      </form>
    </SectionBox>
  );
}