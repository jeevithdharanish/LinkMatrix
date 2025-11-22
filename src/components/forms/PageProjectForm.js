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
    setItems(prev => [...prev, {
      _id: crypto.randomUUID(),
      title: "",
      techStacks: "",
      timeTaken: "",
      summary: "",
      githubLink: "", // <-- ADD THIS
      liveLink: "",   // <-- ADD THIS
    }]);
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
        
        <button
          onClick={addNewProject}
          type="button"
          className="text-blue-500 text-lg flex gap-2 items-center cursor-pointer mb-4 hover:text-blue-700 transition duration-200">
          <FontAwesomeIcon className="bg-blue-500 text-white p-1 rounded-full aspect-square" icon={faPlus} />
          <span>Add new </span>
        </button>

        <div className="space-y-4">
          {items.length === 0 && (
            <div className="text-sm text-gray-500">No projects added yet.</div>
          )}

          {items.map((item) => (
            <div key={item._id} className="p-4 bg-gray-100 rounded-lg">
              <div className="flex gap-3 items-start">
                {/* Input Fields */}
                <div className="flex-1">
                  <input
                    value={item.title}
                    onChange={(e) => updateItem(item._id, "title", e.target.value)}
                    placeholder="Project Title"
                    className="w-full mb-2 rounded shadow-sm px-3 py-2 border border-gray-300 bg-gray-50"
                  />
                  <div className="flex gap-2 mb-2">
                    <input
                      value={item.techStacks}
                      onChange={(e) => updateItem(item._id, "techStacks", e.target.value)}
                      placeholder="Tech (e.g., React, Node.js)"
                      className="rounded px-3 py-2 shadow-sm border border-gray-300 bg-gray-50 flex-1"
                    />
                    <input
                      value={item.timeTaken}
                      onChange={(e) => updateItem(item._id, "timeTaken", e.target.value)}
                      placeholder="Time (e.g., 2 Months)"
                      className="rounded px-3 py-2 shadow-sm border border-gray-300 bg-gray-50 w-40"
                    />
                  </div>

                  {/* --- ADD THESE NEW INPUTS --- */}
                  <div className="flex gap-2 mb-2">
                    <input
                      value={item.githubLink}
                      onChange={(e) => updateItem(item._id, "githubLink", e.target.value)}
                      placeholder="GitHub Link (optional)"
                      className="rounded px-3 py-2 shadow-sm border border-gray-300 bg-gray-50 flex-1"
                    />
                    <input
                      value={item.liveLink}
                      onChange={(e) => updateItem(item._id, "liveLink", e.target.value)}
                      placeholder="Live Demo Link (optional)"
                      className="rounded px-3 py-2 shadow-sm border border-gray-300 bg-gray-50 flex-1"
                    />
                  </div>

                  <textarea
                    value={item.summary}
                    onChange={(e) => updateItem(item._id, "summary", e.target.value)}
                    placeholder="Short summary about the project..."
                    className="w-full mt-1 rounded shadow-sm px-3 py-2 border border-gray-300 bg-gray-50"
                  />
                </div>

                {/* Remove Button */}
                <div className="flex flex-col gap-2 ml-2">
                  <button
                    type="button"
                    onClick={() => removeItem(item._id)}
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