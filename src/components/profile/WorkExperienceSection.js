// This component displays your "work" history
export default function WorkExperienceSection({ workExperience }) {
  if (!workExperience || workExperience.length === 0) {
    return null;
  }

  return (
    // REMOVED max-w-3xl and mx-auto from this section
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Experience</h2>
      <div className="space-y-6">
        {workExperience.map((work) => (
          <div key={work._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{work.role}</h3>
                <p className="text-md text-gray-700">{work.company}</p>
              </div>
              <span className="text-sm text-gray-500 flex-shrink-0 pt-1">
                {work.start} – {work.end}
              </span>
            </div>
            {work.bullets && (
              <ul className="list-disc list-inside text-gray-600 space-y-1 mt-3">
                {work.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}