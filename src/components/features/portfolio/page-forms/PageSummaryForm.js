"use client";
import { useState } from "react";
import SectionBox from "@/components/layout/SectionBox";
import SubmitButton from "@/components/ui/SubmitButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faFileLines } from "@fortawesome/free-solid-svg-icons";
import { savePageSummary } from "@/actions/pageActions";
import FormHeader from "@/components/ui/FormHeader";
import { toast } from "react-hot-toast";

export default function PageSummaryForm({ page, user }) {
  const [summary, setSummary] = useState(page?.summary || "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);

    try {
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
      <FormHeader title="Professional Summary" description="Describe your core professional identity, goals, and expertise" icon={faFileLines} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Write a short summary about yourself..."
          className="w-full min-h-[120px] p-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
        />
        <div className="border-t border-gray-100 dark:border-slate-800 dark:border-slate-800 pt-4 mt-4">
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