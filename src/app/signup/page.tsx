"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(true);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-zinc-900 rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-koulen text-white mb-2">
            <Lock className="inline w-6 h-6 mr-1" />
            {isRegistering ? "Join the Mission" : "Welcome Back"}
          </h1>
          <p className="text-sm text-gray-400">
            {isRegistering ? "Let your light shine in every space" : "Reignite your glow"}
          </p>
        </div>

        <form className="space-y-6">
          {isRegistering && (
            <>
              <div>
                <label className="block text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Address</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="A"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Protect the flame"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold transition"
          >
            {isRegistering ? "Step Into the Light" : "Reignite Now"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          {isRegistering ? (
            <>Already registered?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="text-red-500 hover:underline"
              >
                Sign In
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
        </p>
      </div>
    </div>
  );
}
