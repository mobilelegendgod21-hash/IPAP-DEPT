import React, { useState } from 'react';

import { supabase } from '../lib/supabase';

const Login = ({ setView, setIsLoggedIn }: { setView: (view: string) => void, setIsLoggedIn: (isLoggedIn: boolean) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setIsLoggedIn(true);
        setView('PROFILE'); // Redirect to profile to check/set avatar
      }
    } catch (error: any) {
      alert(error.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black italic tracking-tighter">IPAP DEPT</h1>
          <p className="text-gray-500 mt-2">Welcome back</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white shadow-md rounded-lg p-8 space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-black pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 font-bold uppercase tracking-widest rounded hover:bg-gray-800 transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <span
              className="font-bold text-black hover:underline cursor-pointer"
              onClick={() => setView('REGISTER')}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
      <div className="mt-8">
        <button
          onClick={() => setView('HOME')}
          className="text-xs text-gray-500 hover:text-black transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go back to Home
        </button>
      </div>
    </div>
  );
};

export default Login;
