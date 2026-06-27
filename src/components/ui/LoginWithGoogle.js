
'use client';
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";

export default function LoginWithGoogle() {
  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/account',
        redirect: true
      });
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert('Error signing in with Google. Please check the console for details.');
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 dark:hover:border-slate-600 active:translate-y-0">
      <FontAwesomeIcon icon={faGoogle} className="h-5 w-5 text-red-500" />
      <span>Continue with Google</span>
    </button>
  );
}