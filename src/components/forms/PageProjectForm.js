"use client";
import { useState } from "react";
import SectionBox from "../layout/SectionBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import SubmitButton from "../buttons/SubmitButton";
import { savePageProject } from "@/actions/pageActions";
import { toast } from "react-hot-toast";

export default function PageProjectForm({ page, initialProjects }) {
  const [items, setItems] = useState(initialProjects?.map(p => ({
    ...p,
    _id: p._id || crypto.randomUUID(),
  })) || []);
  const [isSaving, setIsSaving] = useState(false);

  function addNewProject() {
    setItems(prev => [{
      _id: crypto.randomUUID(),
      title: "",
      techStacks: "",
      timeTaken: "",
      summary: "",
      githubLink: "",
      liveLink: "",
    }, ...prev]);
  }

  function updateItem(id, field, value) {
    setItems(prev => {
      const newItems = [...prev];
      const itemIndex = newItems.findIndex(i => i._id === id);
      if (itemIndex > -1) {
        newItems[itemIndex][field] = value;
      }
      return newItems;
    });
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i._id !== id));
  }

  async function save(ev) {
    ev.preventDefault();
    setIsSaving(true);
    const result = await savePageProject(page.uri, items);
    setIsSaving(false);
    if (result.success) {
      toast.success('Projects saved!');
    } else {
      toast.error(`Error: ${result.message || 'Could not save.'}`);
    }
  }

  return (
    <SectionBox>
      <form onSubmit={save}>
        <h2 className="text-xl font-semibold mb-5 text-gray-900">Projects</h2>

        {/* Add New Button - At Top */}
        <button
          onClick={addNewProject}
          type="button"
          className="text-indigo-600 text-sm flex gap-2 items-center cursor-pointer mb-4 hover:text-indigo-700 transition duration-200 font-medium">
          <div className="w-6 h-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
          </div>
          <span>Add new project</span>
        </button>

        <div className="space-y-3">
          {items.length === 0 && (
            <div className="text-sm text-gray-400 text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              No projects added yet.
            </div>
          )}

          {items.map((item) => (
            <div key={item._id} className="p-4 bg-gray-50/50 rounded-xl border border-gray-200 hover:border-indigo-200 transition-all duration-200">
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Project Title</label>
                <input
                  value={item.title}
                  onChange={(e) => updateItem(item._id, "title", e.target.value)}
                  placeholder="e.g., E-Commerce Platform"
                  className="w-full rounded-xl px-3 py-2.5 bg-white border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Tech Stack</label>
                  <input
                    value={item.techStacks}
                    onChange={(e) => updateItem(item._id, "techStacks", e.target.value)}
                    placeholder="e.g., React, Node.js, MongoDB"
                    className="w-full rounded-xl px-3 py-2.5 bg-white border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Duration</label>
                  <input
                    value={item.timeTaken}
                    onChange={(e) => updateItem(item._id, "timeTaken", e.target.value)}
                    placeholder="e.g., 2 Months"
                    className="w-full rounded-xl px-3 py-2.5 bg-white border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">GitHub Link <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
                  <input
                    value={item.githubLink}
                    onChange={(e) => updateItem(item._id, "githubLink", e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full rounded-xl px-3 py-2.5 bg-white border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Live Demo Link <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
                  <input
                    value={item.liveLink}
                    onChange={(e) => updateItem(item._id, "liveLink", e.target.value)}
                    placeholder="https://your-project.vercel.app"
                    className="w-full rounded-xl px-3 py-2.5 bg-white border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Summary / Description</label>
                <textarea
                  value={item.summary}
                  onChange={(e) => updateItem(item._id, "summary", e.target.value)}
                  placeholder="Describe key features, your role, and achievements."
                  rows={3}
                  className="w-full rounded-xl px-3 py-2.5 bg-white border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                />
              </div>

              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => removeItem(item._id)}
                  className="bg-red-50 text-red-500 py-1.5 px-3 rounded-xl text-xs font-medium hover:bg-red-100 transition duration-200"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
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