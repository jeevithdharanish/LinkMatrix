// This component displays your "summary"
export default function SummarySection({ summary }) {
  if (!summary) {
    return null;
  }

  return (
    // REMOVED max-w-3xl and mx-auto from this section
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Summary</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {summary}
        </p>
      </div>
    </section>
  );
}