'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin === 'true') {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedEmail = localStorage.getItem('adminEmail');
    const storedPassword = localStorage.getItem('adminPassword');

    if (email === storedEmail && password === storedPassword) {
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('adminEmail', email);
    localStorage.setItem('adminPassword', password);
    localStorage.setItem('isAdmin', 'true');
    router.push('/admin');
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form
        onSubmit={isRegistering ? handleRegister : handleLogin}
        className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">
          {isRegistering ? 'Admin Signup' : 'Admin Login'}
        </h1>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-800 border border-gray-600 rounded text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-800 border border-gray-600 rounded text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 text-black font-bold py-2 rounded hover:bg-yellow-400"
        >
          {isRegistering ? 'Sign Up' : 'Log In'}
        </button>

        <p className="text-center text-sm text-gray-400">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-yellow-400 underline ml-1"
          >
            {isRegistering ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </form>
    </main>
  );
}
