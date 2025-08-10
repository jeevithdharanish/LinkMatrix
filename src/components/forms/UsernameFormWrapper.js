'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UsernameForm from './UsernameForm';

export default function UsernameFormWrapper({ initialDesiredUsername = '', showError = false }) {
  const [desiredUsername, setDesiredUsername] = useState(String(initialDesiredUsername || ''));
  const router = useRouter();

  useEffect(() => {
    // Always check localStorage for desiredUsername when component mounts
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      const storedUsername = window.localStorage.getItem('desiredUsername');
      if (storedUsername && !desiredUsername) {
        console.log('Found stored username:', storedUsername);
        setDesiredUsername(storedUsername);
        // Clean up localStorage
        window.localStorage.removeItem('desiredUsername');
        // Update URL to include the username (this will trigger server-side validation)
        router.replace(`/claim-username?desiredUsername=${encodeURIComponent(storedUsername)}`);
      }
    }
  }, []); // Run only once when component mounts

  return <UsernameForm desiredUsername={desiredUsername} />;
}
