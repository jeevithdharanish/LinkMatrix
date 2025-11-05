"use client";
import { useState } from "react";
import SectionBox from "../layout/SectionBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faGripLines, faLink, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import SubmitButton from "../buttons/SubmitButton";
/**
 * WorkExperienceForm
 * Props:
 *  - page: { uri: string, work: Array }
 *
 * Work item shape:
 *  {
 *    id: string (client-side temp id),
 *    company: string,
 *    role: string,
 *    start: string, // e.g. 'Jan 2023'
 *    end: string,   // e.g. 'Present' or 'Dec 2024'
 *    bullets: [ "Did X", "Improved Y" ]
 *  }
 */
export default function PageWorkExperienceForm({ page ,user}) {
  const initial = (page?.work || []).map((w, i) => ({ ...w, id: w.id || `w-${i}-${Date.now()}` }));
  const [items, setItems] = useState(initial);
  
  const [message, setMessage] = useState("");

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
    // user types bullets as newline-separated; convert to array
    const bullets = text.split("\n").map(s => s.trim()).filter(Boolean);
    updateItem(idx, { bullets });
  }


  return (
    <SectionBox> 
        <h2 className="text-2xl font-bold mb-4 text-center">WorkExperience</h2>
        <div className="flex gap-2">
          <button
                    onClick={addNewWork}
                    type="button"
                    className="text-blue-500 text-lg flex gap-2 items-center cursor-pointer mb-4 hover:text-blue-700 transition duration-200">
                    <FontAwesomeIcon className="bg-blue-500 text-white p-1 rounded-full aspect-square" icon={faPlus} />
                    <span>Add new</span>
                  </button>
          
        </div>
      

      <div className="space-y-4">
        {items.length === 0 && (
          <div className="text-sm text-white/70">No work entries yet — click “Add Role” to start.</div>
        )}

        {items.map((it, idx) => (
          <div key={it.id} className="p-3 bg-white/3 rounded-md">
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <input
                  value={it.company}
                  onChange={(e) => updateItem(idx, { company: e.target.value })}
                  placeholder="Company (e.g., Acme Inc.)"
                  className="w-full mb-2 rounded shadow px-2 py-1 bg-white/5"
                />
                <input
                  value={it.role}
                  onChange={(e) => updateItem(idx, { role: e.target.value })}
                  placeholder="Role (e.g., Frontend Engineer)"
                  className="w-full mb-2 rounded shadow px-2 py-1 bg-white/5"
                />
                <div className="flex gap-2 mb-2">
                  <input
                    value={it.start}
                    onChange={(e) => updateItem(idx, { start: e.target.value })}
                    placeholder="Start (e.g., Jan 2022)"
                    className="rounded px-2 py-1 shadow bg-white/5 flex-1"
                  />
                  <input
                    value={it.end}
                    onChange={(e) => updateItem(idx, { end: e.target.value })}
                    placeholder="End (e.g., Present)"
                    className="rounded px-2 py-1 shadow bg-white/5 w-40"
                  />
                </div>

                <label className="text-sm text-white/80">Bullets (one per line)</label>
                <textarea
                  rows={4}
                  value={(it.bullets || []).join("\n")}
                  onChange={(e) => setBullets(idx, e.target.value)}
                  placeholder={"• Built X\n• Improved Y by 30%"}
                  className="w-full mt-1 rounded shadow px-2 py-2 bg-white/5"
                />
              </div>

              <div className="flex flex-col gap-2 ml-2">
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="w-full bg-red-500 text-white py-2 px-3 mb-2 h-full flex gap-2 items-center justify-center rounded hover:bg-red-600 transition duration-200">
                      <FontAwesomeIcon icon={faTrash} />
                
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
        <div className="border-t pt-4 mt-4">
          <SubmitButton className="max-w-xs mx-auto bg-blue-500 hover:bg-blue-600 transition duration-200">
            <FontAwesomeIcon icon={faSave} />
            <span>Save</span>
          </SubmitButton>
        </div>
      {message && <div className="text-sm text-white/80">{message}</div>}
    
    </SectionBox>
  );
}
