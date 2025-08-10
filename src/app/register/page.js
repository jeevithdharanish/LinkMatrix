// Add this at the top to make it a Client Component
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import for redirection
import toast from 'react-hot-toast'; // For showing notifications

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [creatingUser, setCreatingUser] = useState(false);
    const router = useRouter(); // Initialize router

    async function handleFormSubmit(ev) {
        ev.preventDefault();
        setCreatingUser(true);

        // Basic validation
        if (!email || !password || password.length < 5) {
            toast.error('Please enter a valid email and a password of at least 5 characters.');
            setCreatingUser(false);
            return;
        }

        try {
            // Send the registration data to your new API endpoint
            const response = await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                toast.success('Registration successful! Please log in.');
                router.push('/login'); // Redirect to login page on success
            } else {
                // Handle errors from the server
                const errorData = await response.json();
                toast.error(errorData.message || 'An error occurred during registration.');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setCreatingUser(false);
        }
    }

    return (
        <section className="mt-8">
            <h1 className="text-center text-primary text-4xl mb-4 font-semibold">
                Register
            </h1>
            <form className="block max-w-sm mx-auto" onSubmit={handleFormSubmit}>
                <input 
                    type="email" 
                    placeholder="email" 
                    value={email}
                    disabled={creatingUser}
                    onChange={ev => setEmail(ev.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                />
                <input 
                    type="password" 
                    placeholder="password" 
                    value={password}
                    disabled={creatingUser}
                    onChange={ev => setPassword(ev.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                />
                <button 
                    type="submit" 
                    disabled={creatingUser}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    {creatingUser ? 'Creating account...' : 'Create Account'}
                </button>
                <div className="my-4 text-center text-gray-500">
                    or
                </div>
                <div className="text-center text-gray-500 mt-4">
                    Already have an account?{' '}
                    <Link className="underline text-blue-500" href={'/login'}>Login here &raquo;</Link>
                </div>
            </form>
        </section>
    );
}