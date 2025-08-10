// import LoginWithGoogle from "@/components/buttons/LoginWithGoogle";

// export default function LoginPage({ searchParams }) {
//   const desiredUsername = searchParams?.username;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
//             <span className="text-white text-2xl font-bold">🔗</span>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">
//             Welcome to LinkMatrix
//           </h1>
//           {desiredUsername ? (
//             <div className="mb-4">
//               <p className="text-gray-600 mb-2">
//                 You&apos;re claiming the username:
//               </p>
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                 <span className="text-blue-800 font-mono font-semibold">
//                   linkto/{desiredUsername}
//                 </span>
//               </div>
//             </div>
//           ) : (
//             <p className="text-gray-600">
//               Sign in to create your link page
//             </p>
//           )}
//         </div>

//         <div className="space-y-4">
//           <LoginWithGoogle />

          
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

// import { useState } from 'react';
// import { signIn } from 'next-auth/react';
// import toast from 'react-hot-toast';
// import Link from 'next/link';
import LoginWithGoogle from "@/components/buttons/LoginWithGoogle";

export default function LoginPage({ searchParams }) {
  const desiredUsername = searchParams?.username;
  
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [loginInProgress, setLoginInProgress] = useState(false);

  // async function handleFormSubmit(ev) {
  //   ev.preventDefault();
  //   setLoginInProgress(true);

  //   await signIn('credentials', { email, password, callbackUrl: '/account' });

  //   setLoginInProgress(false);
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">🔗</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to LinkMatrix
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

          {/* <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              disabled={loginInProgress}
              onChange={ev => setEmail(ev.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              disabled={loginInProgress}
              onChange={ev => setPassword(ev.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <button
              type="submit"
              disabled={loginInProgress}
              className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:bg-blue-300"
            >
              Sign in with Email
            </button>
          </form> */}

        </div>
        
        {/* <div className="text-center text-sm text-gray-500 mt-6">
          No account?{' '}
          {/* <Link href={'/register'} className="underline font-medium text-blue-500 hover:text-blue-700">
            Create one
          </Link> 
        </div> */}
      </div>
    </div>
  );
}