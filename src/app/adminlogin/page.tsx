'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);  // false means login, true means registration

  // Handle login functionality
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {  // Ensure the login API is '/api/admin/login'
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('isAdmin', 'true');  // Set isAdmin flag in localStorage
        router.push('/admin');  // Redirect to the admin page after successful login
      } else {
        alert(result.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login');
    }
  };

  // Navigate to the registration page when the user clicks "Sign Up"
  const handleNavigateToSignup = () => {
    router.push('/signup');  // Navigate to signup page
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-zinc-900 rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-koulen text-white mb-2">
            <Lock className="inline w-6 h-6 mr-1" />
            {isRegistering ? 'Admin Signup' : 'Admin Login'}
          </h1>
          <p className="text-sm text-gray-400">
            {isRegistering ? 'Let your light shine in every space' : 'Reignite your glow'}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Protect the flame"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-black font-bold py-2 rounded hover:bg-red-500"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          {isRegistering ? (
            <>Already registered?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(false)}  // Toggle to Login form
                className="text-red-400 underline ml-1"
              >
                Login
              </button></>
          ) : (
            <>Don’t have an account?{' '}
              <button
                type="button"
                onClick={handleNavigateToSignup}  // Navigate to signup page
                className="text-red-400 underline ml-1"
              >
                Sign Up
              </button></>
          )}
        </p>
      </div>
    </div>
  );
}
