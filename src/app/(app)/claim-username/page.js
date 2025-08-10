import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import UsernameFormWrapper from "@/components/forms/UsernameFormWrapper";
import {Page} from "@/models/page";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export default async function ClaimUsernamePage({searchParams}) {
  const session = await getServerSession(authOptions);

  // Safely extract and serialize searchParams
  const rawDesiredUsername = searchParams?.desiredUsername;
  const desiredUsername = rawDesiredUsername ?
    (Array.isArray(rawDesiredUsername) ? rawDesiredUsername[0] : String(rawDesiredUsername)) : '';

  if (!session) {
    return redirect('/');
  }

  mongoose.connect(process.env.MONGO_URI);
  const page = await Page.findOne({owner: session?.user?.email});

  // If user already has a page, redirect to account
  if (page) {
    return redirect('/account');
  }

  // Check if desired username already exists (server-side validation)
  let usernameError = '';
  if (desiredUsername) {
    const existingPage = await Page.findOne({ uri: desiredUsername });
    if (existingPage) {
      usernameError = `The username "${desiredUsername}" is already taken. Please choose a different one.`;
    }
  }

  // Ensure all props are plain objects/primitives - explicitly convert to strings/booleans
  const pageProps = {
    desiredUsername: String(desiredUsername),
    usernameError: String(usernameError),
    hasError: Boolean(usernameError)
  };

  return (
    <div className=" bg-gray-50 py-2 px-4 w-full">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center p-2">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Claim Your Username</h1>
          {pageProps.desiredUsername ? (
            <p className="text-gray-600 text-lg md:text-xl">
              You want to claim: <strong className="text-blue-600">linkto/{pageProps.desiredUsername}</strong>
            </p>
          ) : (
            <p className="text-gray-600 text-lg md:text-xl">
              Choose your unique username to get started
            </p>
          )}
        </div>
        
        {/* Error Section */}
        {pageProps.hasError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-2 rounded-r-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Username Not Available</h3>
                <p className="text-sm text-red-700 mt-1">{pageProps.usernameError}</p>
                <p className="text-sm text-red-600 mt-2">Please try a different username below:</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Form Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <UsernameFormWrapper
            initialDesiredUsername={pageProps.hasError ? '' : pageProps.desiredUsername}
            showError={pageProps.hasError}
            key={`form-${pageProps.desiredUsername}-${pageProps.hasError}`}
          />
        </div>

        

        
      </div>
    </div>
  );
}
