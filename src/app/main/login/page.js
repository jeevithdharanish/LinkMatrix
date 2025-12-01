
'use client';
import LoginWithGoogle from "@/components/buttons/LoginWithGoogle";

export default function LoginPage({ searchParams }) {
  const desiredUsername = searchParams?.username;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">🔗</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to LinkMate
          </h1>
          {desiredUsername ? (
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                You&apos;re claiming the username:
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <span className="text-blue-800 font-mono font-semibold">
                  linkto/{desiredUsername}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              Sign in to create your link page
            </p>
          )}
        </div>
        <div className="space-y-4">
          <LoginWithGoogle />
        </div>
      </div>
    </div>
  );
}