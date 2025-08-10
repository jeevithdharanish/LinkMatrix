
'use client';
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {signIn} from "next-auth/react";

export default function LoginWithGoogle() {
  const handleGoogleSignIn = async () => {
    try {
      console.log('Attempting to sign in with Google...');
      const result = await signIn('google', {
        callbackUrl: '/account',
        redirect: true
      });
      console.log('SignIn result:', result);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert('Error signing in with Google. Please check the console for details.');
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-md hover:bg-gray-50">
      <FontAwesomeIcon icon={faGoogle} className="h-5 w-5 text-red-500" />
      <span>Continue with Google</span>
    </button>
  );
}