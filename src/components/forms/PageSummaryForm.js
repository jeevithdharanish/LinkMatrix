"use client";
import { useState } from "react";
import SectionBox from "../layout/SectionBox";
import SubmitButton from "../buttons/SubmitButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { savePageSummary } from "@/actions/pageActions"; // Import the Server Action
import { toast } from "react-hot-toast"; // Import toast

export default function PageSummaryForm({ page, user }) {
  const [summary, setSummary] = useState(page?.summary || "");
  const [isSaving, setIsSaving] = useState(false); // Changed from 'loading'

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Call the Server Action
      const result = await savePageSummary(page.uri, summary);

      if (result.success) {
        toast.success("Summary saved!");
      } else {
        toast.error(`Error: ${result.message || 'Could not save.'}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Error in handleSubmit:", error);
    }

    setIsSaving(false);
  }

  return (
    <SectionBox>
      <h2 className="text-2xl font-bold mb-4 text-center">Professional Summary</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Write a short summary about yourself..."
          // Added styling to match your other forms (light theme)
          className="w-full min-h-[120px] p-3 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
        />
        <div className="border-t pt-4 mt-4">
          <SubmitButton 
            disabled={isSaving}
            className="max-w-xs mx-auto bg-blue-500 hover:bg-blue-600 transition duration-200">
            <FontAwesomeIcon icon={faSave} />
            {/* Show saving state */}
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </SubmitButton>
        </div>
      </form>
    </SectionBox>
  );
}