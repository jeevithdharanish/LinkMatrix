'use client';

import { useState } from "react";
import { savePageSkills } from "@/actions/pageActions";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes, faPlus, faCode, faLaptopCode, faServer, faTools, faGraduationCap, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import SectionBox from "@/components/layout/SectionBox";
import SubmitButton from "@/components/ui/SubmitButton";
import FormHeader from "@/components/ui/FormHeader";

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
  const convertSkills = (skills) => {
    if (!skills) return {};
    if (Array.isArray(skills)) {
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

    const categorySkills = skills[activeCategory] || [];
    if (categorySkills.find(s => s.name.toLowerCase() === trimmedSkill.toLowerCase())) {
      toast.error('Skill already added in this category.');
      return;
    }

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

  // Coursework categories (noProgress) have no proficiency slider — skills show as plain tags
  const activeCategoryConfig = CATEGORIES.find(c => c.name === activeCategory);
  const hideProgress = activeCategoryConfig?.noProgress;
  const newSkillPlaceholder = hideProgress
    ? "e.g., OOPs, OS, DBMS, CN, DSA..."
    : "e.g., React, Python, Docker...";

  return (
    <SectionBox>
      <form onSubmit={save}>
        <FormHeader title="Skills & Technologies" description="List your technical competencies and group them by category" icon={faCode} />

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => setActiveCategory(cat.name)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${activeCategory === cat.name
                ? 'bg-brand-grad text-white shadow-md'
                : 'bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-700'
                }`}
            >
              <FontAwesomeIcon icon={cat.icon} className="w-3 h-3" />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Add New Skill */}
        <div className="bg-gray-50/80 dark:bg-slate-800/40 rounded-xl p-4 mb-5 border border-gray-100 dark:border-slate-800">
          <h3 className="font-medium text-gray-700 dark:text-slate-300 mb-3 text-sm">
            Add to {activeCategory}
          </h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={newSkillName}
              onChange={e => setNewSkillName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={newSkillPlaceholder}
              className="flex-grow rounded-xl px-3.5 py-2.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
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
                  className="w-24 accent-indigo-500"
                />
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 w-10 text-right">{newSkillProficiency}%</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleAddNewSkill}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm font-medium"
            >
              <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
              Add
            </button>
          </div>
        </div>

        {/* Skills List for Current Category */}
        <div className="mb-5">
          <h3 className="font-medium text-gray-700 dark:text-slate-300 mb-3 flex items-center gap-2 text-sm">
            <div className="w-6 h-6 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={activeCategoryConfig?.icon || faCode} className="text-indigo-500 dark:text-indigo-400 text-xs" />
            </div>
            {activeCategory}
            <span className="text-xs font-normal text-gray-400 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {currentCategorySkills.length}
            </span>
          </h3>

          {(() => {
            if (currentCategorySkills.length === 0) {
              return (
                <div className="text-center py-6 text-sm text-gray-400 dark:text-slate-400 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
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
                      className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3.5 py-2 hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all duration-200"
                    >
                      <span className="font-medium text-gray-700 dark:text-slate-300 text-sm">{skill.name}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(activeCategory, skill.name)}
                        aria-label={`Remove ${skill.name}`}
                        className="p-0.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              );
            }

            // Regular skills with progress bars
            return (
              <div className="space-y-2">
                {currentCategorySkills.map((skill) => (
                  <div
                      key={skill.name}
                      className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-gray-700 dark:text-slate-300 text-sm">{skill.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800/80 rounded-lg px-2 py-1">
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="5"
                          value={skill.proficiency}
                          onChange={e => updateProficiency(activeCategory, skill.name, parseInt(e.target.value))}
                          className="w-28 accent-indigo-500"
                        />
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 w-10 text-right">{skill.proficiency}%</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeSkill(activeCategory, skill.name)}
                        aria-label={`Remove ${skill.name} skill`}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Summary of All Categories */}
        <div className="bg-gray-50/80 dark:bg-slate-800/40 rounded-xl p-4 mb-5 border border-gray-100 dark:border-slate-800">
          <h3 className="font-medium text-gray-700 dark:text-slate-300 mb-3 text-sm">All Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {CATEGORIES.map(cat => {
              const count = (skills[cat.name] || []).length;
              return (
                <button
                  type="button"
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`rounded-xl p-3 text-center border transition-all duration-200 ${activeCategory === cat.name
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800'
                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                    }`}
                >
                  <FontAwesomeIcon icon={cat.icon} className={`w-4 h-4 mb-1 ${activeCategory === cat.name ? 'text-indigo-500' : 'text-gray-400 dark:text-slate-500'}`} />
                  <div className="text-lg font-bold text-gray-800 dark:text-white">{count}</div>
                  <div className="text-[10px] text-gray-500 dark:text-slate-400 leading-tight">{cat.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-slate-800 pt-4">
          <SubmitButton
            disabled={isSaving}
            className="max-w-xs mx-auto">
            <FontAwesomeIcon icon={faSave} />
            <span className="ml-1">{isSaving ? "Saving..." : "Save Skills"}</span>
          </SubmitButton>
        </div>
      </form>
    </SectionBox>
  );
}