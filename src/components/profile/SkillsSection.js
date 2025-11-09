// This component displays your "skills" as tags
export default function SkillsSection({ skills }) {
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    // REMOVED max-w-3xl and mx-auto from this section
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span key={skill} className="bg-blue-100 text-blue-800 rounded-full px-4 py-1 text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}