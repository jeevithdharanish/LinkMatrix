'use client';

import { useState } from "react";
// Make sure to import the *new* savePageSkills action
import { savePageSkills } from "@/actions/pageActions";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons"; // Import the 'plus' icon
import SectionBox from "@/components/layout/SectionBox";
import SubmitButton from "@/components/buttons/SubmitButton";

// The 'initialSkills' prop will now be an array of strings, e.g., ['React', 'MongoDB']
export default function PageSkillsForm({ page, initialSkills }) {
  // State is now just a simple array of strings
  const [skills, setSkills] = useState(initialSkills || []);
  const [newSkillName, setNewSkillName] = useState(''); 
  const [isSaving, setIsSaving] = useState(false);

  async function save(ev) {
    ev.preventDefault();
    setIsSaving(true);
    
    // Pass the URI and the simple array of strings
    const result = await savePageSkills(page.uri, skills);
    
    if (result.success) {
      toast.success('Skills saved!');
    } else {
      toast.error(`Error: ${result.message || 'Could not save.'}`);
    }
    
    setIsSaving(false);
  }

  // Adds the skill string from the input field to the state
  function handleAddNewSkill() {
    const trimmedSkill = newSkillName.trim();
    if (trimmedSkill === '') {
      return;
    }
    if (skills.find(s => s.toLowerCase() === trimmedSkill.toLowerCase())) {
        toast.error('Skill already added.');
        return;
    }

    // Add the new skill (string) to the skills array (string[])
    setSkills(prev => [...prev, trimmedSkill]);
    setNewSkillName(''); // Clear the input field
  }

  function removeSkill(skillToRemove) {
    // Filter the array of strings
    setSkills(prev => prev.filter(s => s.toLowerCase() !== skillToRemove.toLowerCase()));
  }
  
  function handleKeyDown(ev) {
    // We still allow 'Enter' to add the skill
    if (ev.key === 'Enter') {
      ev.preventDefault();
      handleAddNewSkill();
    }
  }

  return (
    <SectionBox>
      <form onSubmit={save}>
        <h2 className="text-2xl font-bold mb-4 text-center">Skills</h2>
        {/* --- ADD NEW BUTTON --- */}
          <button
            type="button"
            onClick={handleAddNewSkill}
           className="text-blue-500 text-lg flex gap-2 items-center cursor-pointer mb-4 hover:text-blue-700 transition duration-200">
          
            <FontAwesomeIcon className="bg-blue-500 text-white p-1 rounded-full aspect-square" icon={faPlus} />
          <span>Add new</span>
          </button>
        {/* --- MODIFIED SECTION --- */}
        <div className="flex gap-2 mb-4">
          <input
            value={newSkillName}
            onChange={e => setNewSkillName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., React (press Enter or click Add)"
            // Use 'flex-grow' to let the input fill the space
            className="flex-grow rounded shadow px-3 py-2 border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
          />
          
        </div>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
          {skills.length === 0 && (
            <span className="text-sm text-gray-400">No skills added yet.</span>
          )}
          {skills.length > 0 && skills.map((skillName) => (
            <div 
              key={skillName} 
              className="bg-gray-200 text-gray-800 rounded-full px-4 py-2 text-sm flex items-center gap-2"
            >
              <span>{skillName}</span>
              <button
                onClick={() => removeSkill(skillName)}
                type="button"
                className="text-gray-500 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

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