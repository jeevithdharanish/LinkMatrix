
import {useFormStatus} from 'react-dom';

export default function SubmitButton({children, className=''}) {
  const {pending} = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={"bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed text-white disabled:text-gray-200 py-3 px-6 rounded-xl mx-auto w-full flex gap-2 items-center justify-center font-medium shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-200 " + className}
    >
      {pending && (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Saving...
        </span>
      )}
      {!pending && children}
    </button>
  );
}