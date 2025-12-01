'use client';

import { useState } from "react";
import { savePageSkills } from "@/actions/pageActions";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes, faPlus, faCode, faLaptopCode, faServer, faTools, faGraduationCap, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import SectionBox from "@/components/layout/SectionBox";
import SubmitButton from "@/components/buttons/SubmitButton";

// Predefined categories
const CATEGORIES = [
  { name: "Programming Languages", icon: faCode },
  { name: "Frontend Development", icon: faLaptopCode },
  { name: "Backend Development", icon: faServer },
  { name: "Tools & Technologies", icon: faTools },
  { name: "Related Coursework", icon: faGraduationCap, noProgress: true },
  { name: "Other Coursework", icon: faBookOpen, noProgress: true },
];

export default function PageSkillsForm({ page, initialSkills }) {
  // Convert old format (array) to new format (object) if needed
  const convertSkills = (skills) => {
    if (!skills) return {};
    if (Array.isArray(skills)) {
      // Old format: convert to new format with default category
      if (skills.length === 0) return {};
      return {
        "Programming Languages": skills.map(s => ({ name: s, proficiency: 80 }))
      };
    }
    if (typeof skills === 'object') {
      return skills;
    }
    return {};
  };

  const [skills, setSkills] = useState(() => convertSkills(initialSkills));
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].name);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState(80);
  const [isSaving, setIsSaving] = useState(false);

  async function save(ev) {
    ev.preventDefault();
    setIsSaving(true);
    
    try {
      if (!page?.uri) {
        toast.error('Page URI is missing. Please refresh the page.');
        setIsSaving(false);
        return;
      }
      
      const result = await savePageSkills(page.uri, skills);
      
      if (result?.success) {
        toast.success('Skills saved!');
      } else {
        toast.error(`Error: ${result?.message || 'Could not save.'}`);
      }
    } catch (error) {
      console.error('Error saving skills:', error);
      toast.error('An error occurred while saving skills.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleAddNewSkill() {
    const trimmedSkill = newSkillName.trim();
    if (trimmedSkill === '') {
      toast.error('Please enter a skill name');
      return;
    }

    // Check if skill already exists in current category
    const categorySkills = skills[activeCategory] || [];
    if (categorySkills.find(s => s.name.toLowerCase() === trimmedSkill.toLowerCase())) {
      toast.error('Skill already added in this category.');
      return;
    }

    // Add skill to the active category
    setSkills(prev => ({
      ...prev,
      [activeCategory]: [
        ...(prev[activeCategory] || []),
        { name: trimmedSkill, proficiency: newSkillProficiency }
      ]
    }));
    
    setNewSkillName('');
    setNewSkillProficiency(80);
  }

  function removeSkill(category, skillName) {
    setSkills(prev => ({
      ...prev,
      [category]: prev[category].filter(s => s.name !== skillName)
    }));
  }

  function updateProficiency(category, skillName, newProficiency) {
    setSkills(prev => ({
      ...prev,
      [category]: prev[category].map(s => 
        s.name === skillName ? { ...s, proficiency: newProficiency } : s
      )
    }));
  }

  function handleKeyDown(ev) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      handleAddNewSkill();
    }
  }

  const currentCategorySkills = skills[activeCategory] || [];

  return (
    <SectionBox>
      <form onSubmit={save}>
        <h2 className="text-2xl font-bold mb-6 text-center">Skills & Technologies</h2>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeCategory === cat.name
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FontAwesomeIcon icon={cat.icon} className="w-4 h-4" />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Add New Skill */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">
            Add to {activeCategory}
          </h3>
          {(() => {
            const currentCat = CATEGORIES.find(c => c.name === activeCategory);
            const hideProgress = currentCat?.noProgress;
            const placeholder = hideProgress 
              ? "e.g., OOPs, OS, DBMS, CN, DSA..." 
              : "e.g., React, Python, Docker...";
            
            return (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="flex-grow rounded-lg shadow-sm px-4 py-2 border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {!hideProgress && (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={newSkillProficiency}
                      onChange={e => setNewSkillProficiency(parseInt(e.target.value))}
                      className="w-24 accent-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-600 w-12">{newSkillProficiency}%</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleAddNewSkill}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                  Add
                </button>
              </div>
            );
          })()}
        </div>

        {/* Skills List for Current Category */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={CATEGORIES.find(c => c.name === activeCategory)?.icon || faCode} />
            {activeCategory}
            <span className="text-sm font-normal text-gray-400">
              ({currentCategorySkills.length} skills)
            </span>
          </h3>
          
          {(() => {
            const currentCat = CATEGORIES.find(c => c.name === activeCategory);
            const hideProgress = currentCat?.noProgress;
            
            if (currentCategorySkills.length === 0) {
              return (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl">
                  No skills added yet in this category.
                </div>
              );
            }
            
            // For coursework categories, show as tags
            if (hideProgress) {
              return (
                <div className="flex flex-wrap gap-2">
                  {currentCategorySkills.map((skill) => (
                    <div 
                      key={skill.name}
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2"
                    >
                      <span className="font-medium text-gray-800">{skill.name}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(activeCategory, skill.name)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              );
            }
            
            // Regular skills with progress bars
            return (
              <div className="space-y-3">
                {currentCategorySkills.map((skill) => (
                  <div 
                    key={skill.name}
                    className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-gray-800">{skill.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={skill.proficiency}
                        onChange={e => updateProficiency(activeCategory, skill.name, parseInt(e.target.value))}
                        className="w-32 accent-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-600 w-12">{skill.proficiency}%</span>
                      
                      <button
                        type="button"
                        onClick={() => removeSkill(activeCategory, skill.name)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Summary of All Categories */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">All Categories Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map(cat => {
              const count = (skills[cat.name] || []).length;
              return (
                <div 
                  key={cat.name}
                  className="bg-white rounded-lg p-3 text-center border border-gray-200"
                >
                  <FontAwesomeIcon icon={cat.icon} className="w-5 h-5 text-blue-500 mb-1" />
                  <div className="text-lg font-bold text-gray-800">{count}</div>
                  <div className="text-xs text-gray-500">{cat.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <SubmitButton 
            disabled={isSaving} 
            className="max-w-xs mx-auto bg-blue-500 hover:bg-blue-600 transition duration-200">
            <FontAwesomeIcon icon={faSave} />
            <span className="ml-2">{isSaving ? "Saving..." : "Save Skills"}</span>
          </SubmitButton>
        </div>
      </form>
    </SectionBox>
  );
}