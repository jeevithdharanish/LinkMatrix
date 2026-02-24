'use client';

import { useRouter } from "next/navigation";

export default function HeroForm({ user }) {
  const router = useRouter();

  async function handleSubmit(ev) {
    ev.preventDefault();
    const form = ev.target;
    const input = form.querySelector('input');
    const username = input.value;
    if (username.length > 0) {
      if (user) {
        router.push('/account?desiredUsername=' + encodeURIComponent(username));
      } else {
        window.localStorage.setItem('desiredUsername', username);
        router.push(`/login?username=${encodeURIComponent(username)}`);
      }
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="inline-flex items-center bg-white border border-gray-200 shadow-elevated rounded-2xl overflow-hidden max-w-md mx-auto w-full"
      >
        <span className="bg-white py-4 pl-5 text-gray-400 font-medium text-sm"><label htmlFor="hero-username" className="sr-only">Username</label>linkmate/</span>
        <input
          id="hero-username"
          type="text"
          className="outline-none flex-1 text-gray-900 font-medium"
          style={{ backgroundColor: 'white', marginBottom: 0, paddingLeft: 0, border: 'none', boxShadow: 'none' }}
          placeholder="yourname"
          aria-label="Choose your username"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 px-6 whitespace-nowrap hover:shadow-lg transition-all duration-200 font-medium text-sm"
        >
          Claim
        </button>
      </form>

      <div className="mt-10 max-w-lg mx-auto">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-2">
              <span className="text-xl">💼</span>
            </div>
            <p className="font-semibold text-gray-800 text-sm">Portfolio ready</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mb-2">
              <span className="text-xl">⚡</span>
            </div>
            <p className="font-semibold text-gray-800 text-sm">Fast & beautiful</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-2">
              <span className="text-xl">📊</span>
            </div>
            <p className="font-semibold text-gray-800 text-sm">Smart analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}