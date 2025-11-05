"use client";
import { useState } from "react";
import SectionBox from "../layout/SectionBox";
import SubmitButton from "../buttons/SubmitButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

export default function PageSummaryForm({ page,user }) {
  const [summary, setSummary] = useState(page?.summary || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/page/update-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uri: page.uri, summary }),
      });

      if (res.ok) {
        setMessage("✅ Summary updated successfully!");
      } else {
        setMessage("❌ Failed to update summary.");
      }
    } catch (error) {
      setMessage("⚠️ Error saving summary.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SectionBox>
   
      <h2 className="text-2xl font-bold mb-4 text-center">Professional Summary</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Write a short summary about yourself..."
          className="w-full min-h-[120px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <div className="border-t pt-4 mt-4">
              <SubmitButton className="max-w-xs mx-auto bg-blue-500 hover:bg-blue-600 transition duration-200">
                <FontAwesomeIcon icon={faSave} />
                <span>Save</span>
              </SubmitButton>
            </div>
      </form>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    
    
    </SectionBox>
  );
}
