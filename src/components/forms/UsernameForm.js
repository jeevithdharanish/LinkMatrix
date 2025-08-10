'use client';
import grabUsername from "@/actions/grabUsername";
import SubmitButton from "@/components/buttons/SubmitButton";
import RightIcon from "@/components/icons/RightIcon";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UsernameForm({ desiredUsername = '' }) {
  const [taken, setTaken] = useState(false);
  const router = useRouter();
  console.log(desiredUsername)
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username =formData.get('username');

    const result = await grabUsername({username});
    setTaken(result === false);

    if (result) {
      router.push('/account?created=' + formData.get('username'));
    }
  }

  return (
    <div className=" bg-gradient-to-br to-indigo-100 flex items-center justify-center ">
      <div className="bg-white   p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">@</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Claim Your Username
          </h1>
          <p className="text-gray-600">
            Choose a unique username for your profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             
            </div>
            <input
              name="username"
              className="block w-full pl-32 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-lg"
              defaultValue={String(desiredUsername || '')}
              type="text"
              placeholder="username"
              required
            />
          </div>

          {taken && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">
                    This username is already taken. Please try another one.
                  </p>
                </div>
              </div>
            </div>
          )}

          <SubmitButton className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg">
            <span>Claim Username</span>
            <RightIcon />
          </SubmitButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Your username will be part of your public profile URL
          </p>
        </div>
      </div>
    </div>
  );
}
