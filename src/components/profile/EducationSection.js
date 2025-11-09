// This component displays your "education" history
export default function EducationSection({ education }) {
  if (!education || education.length === 0) {
    return null;
  }

  return (
    // REMOVED max-w-3xl and mx-auto from this section
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
      <div className="space-y-6">
        {education.map((edu) => (
          <div key={edu._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-md text-gray-700">{edu.school}</p>
              </div>
              <span className="text-sm text-gray-500 flex-shrink-0 pt-1">
                {edu.start} – {edu.end}
              </span>
            </div>
            {edu.description && (
              <p className="text-gray-600 mt-3">{edu.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}