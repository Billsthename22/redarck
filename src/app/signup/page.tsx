'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';

import { useRouter } from 'next/navigation';  // Importing useRouter to navigate

export default function AuthPage() {
  const router = useRouter();  // Use Next.js router to navigate
  const [isRegistering, setIsRegistering] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');

  // Function to handle form submission for signup
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const data = {
      fullName,
      email,
      address,
      password
    };

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to register. Please try again.');
      }

      const result = await response.json();

      if (response.ok) {
        console.log(result.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  // Navigate to the login page when the user clicks "Login"
  const handleNavigateToLogin = () => {
    router.push('/adminlogin');  // Navigate to login page
  };

import { useRouter } from 'next/navigation';

export default function AdminSignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
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

            {isRegistering ? 'Join the Mission' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-gray-400">
            {isRegistering ? 'Let your light shine in every space' : 'Reignite your glow'}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div>
                <label className="block text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="A"
                />
              </div>
            </>
          )}

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

            {isRegistering ? 'Step Into the Light' : 'Reignite Now'}

            Create Admin Account

          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
        </form>

        <p className="text-center text-sm text-gray-400">

          {isRegistering ? (
            <>Already registered?{' '}
              <button
                type="button"
                onClick={handleNavigateToLogin}  // Navigate to login page when clicked
                className="text-red-500 hover:underline"
              >
                Login
              </button></>
          ) : (
            <>New here?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className="text-red-500 hover:underline"
              >
                Create an account
              </button></>
          )}

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
