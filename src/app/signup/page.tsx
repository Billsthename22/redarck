'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminSignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        setError(result.error || 'Signup failed');
        return;
      }
  
      localStorage.setItem('isAdmin', 'true');
      setSuccess('Admin account created successfully');
  
      // ✅ Show alert
      alert('Account registered successfully');
  
      // ✅ Redirect to login
      router.push('/adminlogin');
    } catch (err) {
      console.error(err);
      setError('Unexpected error occurred');
    }
  };
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-zinc-900 rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-koulen text-white mb-2">
            <Lock className="inline w-6 h-6 mr-1" />
            Admin Sign Up
          </h1>
          <p className="text-sm text-gray-400">Create an account to manage the store</p>
        </div>

        <form className="space-y-6" onSubmit={handleSignup}>
          <div>
            <label className="block text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Create a strong password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold transition"
          >
            Create Admin Account
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
        </form>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/adminlogin')}
            className="text-red-500 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
