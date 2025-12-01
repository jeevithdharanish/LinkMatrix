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
    // ... (save function is unchanged)
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
        <h2 className="text-2xl font-bold mb-4 text-center">Projects</h2>
        
        {/* Add New Button - At Top */}
        <button
          onClick={addNewProject}
          type="button"
          className="text-blue-500 text-lg flex gap-2 items-center cursor-pointer mb-4 hover:text-blue-700 transition duration-200">
          <FontAwesomeIcon className="bg-blue-500 text-white p-1 rounded-full aspect-square" icon={faPlus} />
          <span>Add new project</span>
        </button>
        
        <div className="space-y-4">
          {items.length === 0 && (
            <div className="text-sm text-gray-400">No projects added yet.</div>
          )}

          {items.map((item) => (
            <div key={item._id} className="p-4 bg-white/10 rounded-lg">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">Project Title</label>
                <input
                  value={item.title}
                  onChange={(e) => updateItem(item._id, "title", e.target.value)}
                  placeholder="e.g., E-Commerce Platform"
                  className="w-full rounded shadow px-3 py-2 bg-white/5 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Tech Stack</label>
                  <input
                    value={item.techStacks}
                    onChange={(e) => updateItem(item._id, "techStacks", e.target.value)}
                    placeholder="e.g., React, Node.js, MongoDB"
                    className="w-full rounded shadow px-3 py-2 bg-white/5 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Duration</label>
                  <input
                    value={item.timeTaken}
                    onChange={(e) => updateItem(item._id, "timeTaken", e.target.value)}
                    placeholder="e.g., 2 Months"
                    className="w-full rounded shadow px-3 py-2 bg-white/5 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">GitHub Link <span className="text-gray-500 font-normal">(optional)</span></label>
                  <input
                    value={item.githubLink}
                    onChange={(e) => updateItem(item._id, "githubLink", e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full rounded shadow px-3 py-2 bg-white/5 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Live Demo Link <span className="text-gray-500 font-normal">(optional)</span></label>
                  <input
                    value={item.liveLink}
                    onChange={(e) => updateItem(item._id, "liveLink", e.target.value)}
                    placeholder="https://your-project.vercel.app"
                    className="w-full rounded shadow px-3 py-2 bg-white/5 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Summary / Description</label>
                <textarea
                  value={item.summary}
                  onChange={(e) => updateItem(item._id, "summary", e.target.value)}
                  placeholder="Describe key features, your role, and achievements. Use new lines for bullet points."
                  rows={4}
                  className="w-full rounded shadow px-3 py-2 bg-white/5 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => removeItem(item._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600 transition duration-200"
                >
                  <FontAwesomeIcon icon={faTrash} /> Remove
                </button>
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