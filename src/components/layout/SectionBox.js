export default function SectionBox({children, className = ''}) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
}