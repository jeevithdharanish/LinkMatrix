'use client';

import {useRouter} from "next/navigation";

export default function HeroForm({user}) {
  const router = useRouter();

  async function handleSubmit(ev) {
    ev.preventDefault();
    const form = ev.target;
    const input = form.querySelector('input');
    const username = input.value;
    if (username.length > 0) {
      if (user) {
        router.push('/account?desiredUsername='+username);
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
  className="inline-flex items-center shadow-lg bg-white shadow-gray-500/20 rounded-lg overflow-hidden"
>
  <span className="bg-white py-4 pl-4">linkto/</span>
  <input
    type="text"
    className="outline-none flex-1"
    style={{ backgroundColor: 'white', marginBottom: 0, paddingLeft: 0 }}
    placeholder="username"
  />
  <button
    type="submit"
    className="bg-blue-500 text-white py-4 px-6 whitespace-nowrap hover:bg-blue-600 transition-colors"
  >
    Join
  </button>
</form>

    <div className="mt-8 text-gray-600 max-w-lg mx-auto">
  <p className="text-center">
    Create a single, beautiful link to showcase your work, content, and social profiles.
  </p>
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center mt-6">
    <div className="flex flex-col items-center">
      <span className="text-2xl">🎨</span>
      <p className="font-semibold mt-1">Customize fully</p>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-2xl">🔗</span>
      <p className="font-semibold mt-1">Add unlimited links</p>
    </div>
    <div className="flex flex-col items-center col-span-2 sm:col-span-1">
      <span className="text-2xl">📈</span>
      <p className="font-semibold mt-1">Track analytics</p>
    </div>
  </div>
</div>
    </div>
  );
}