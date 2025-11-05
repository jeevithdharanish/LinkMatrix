"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faTrash, faSpinner } from "@fortawesome/free-solid-svg-icons"; // <-- Added faSpinner
import SectionBox from "../layout/SectionBox";
import SubmitButton from "../buttons/SubmitButton";

export default function PageSkillsForm({ page }) {
  const [skills, setSkills] = useState(page?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // This function is for the "Enter" key or "Add" button
  function addSkill() {
    if (!newSkill.trim()) return;
    setSkills(prev => [...prev, newSkill.trim()]);
    setNewSkill("");
  }
  
  // Handle "Enter" key press on the input
  function handleInputKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // <-- Stop the form from submitting
      addSkill();
    }
  }

  function removeSkill(skill) {
    setSkills(prev => prev.filter(s => s !== skill));
  }

  // This function is now called by the <form>'s onSubmit
  async function saveAll(event) {
    event.preventDefault(); // <-- Stop the default form submission
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/page/update-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // You were passing `uri: page.uri`, but your API likely
        // just needs the skills. The user is identified by the session.
        body: JSON.stringify({ skills }),
      });
      if (res.ok) {
        setMessage("✅ Skills saved successfully.");
      } else {
        setMessage("❌ Save failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  return (
    // We wrap everything in a <form> and hook up onSubmit
    <SectionBox>
      <form onSubmit={saveAll}> 
        <h2 className="text-2xl font-bold mb-4 text-center">Skills</h2>
        <button
          onClick={addSkill}
          type="button"
          className="text-blue-500 text-lg flex gap-2 items-center cursor-pointer mb-4 hover:text-blue-700 transition duration-200">
          <FontAwesomeIcon className="bg-blue-500 text-white p-1 rounded-full aspect-square" icon={faPlus} />
          <span>Add new</span>
        </button>
        {/* --- This is the new, improved "Add Skill" section --- */}
        <label className="text-sm text-white/80">Add a new skill</label>
        <div className="flex gap-2 mb-4">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleInputKeyDown} // <-- Handles "Enter" key
            placeholder="e.g., React, MongoDB"
            className="flex-1 rounded px-3 py-2 bg-white/5"
          />
          
        </div>

        {/* --- This is the list of added skills (no changes) --- */}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            // AFTER (Visible on white)
              <div
                key={idx}
                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
              >
              <span>{skill}</span>
              <button
                type="button" // <-- Add type="button"
                onClick={() => removeSkill(skill)}
                className="text-red-400 hover:text-red-600"
                title="Remove skill"
              >
                <FontAwesomeIcon icon={faTrash} size="sm" />
              </button>
            </div>
          ))}
        </div>

        {/* --- The Save button --- */}
        <div className="border-t pt-4 mt-4">
                  <SubmitButton className="max-w-xs mx-auto bg-blue-500 hover:bg-blue-600 transition duration-200">
                    <FontAwesomeIcon icon={faSave} />
                    <span>Save</span>
                  </SubmitButton>
                </div>
        {message && <p className="mt-4 text-sm text-white/80 text-center">{message}</p>}
      </form>
    </SectionBox>
  );
}