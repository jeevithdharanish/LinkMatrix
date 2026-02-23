export default function SectionBox({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}