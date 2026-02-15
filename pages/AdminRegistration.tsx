import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AdminRegistrationProps {
    setView: (view: any) => void;
}

const AdminRegistration: React.FC<AdminRegistrationProps> = ({ setView }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secretCode, setSecretCode] = useState('');
    const [loading, setLoading] = useState(false);

    // Hardcoded secret for demo purposes. Ideally valid on backend via function, but this works for client-side check before insert trigger.
    const ADMIN_SECRET = 'IPAP2025';

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (secretCode !== ADMIN_SECRET) {
            alert('Invalid Admin Secret Code.');
            setLoading(false);
            return;
        }

        try {
            // 1. Sign Up
            const { data: { user }, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: 'Admin User', // Default name
                        is_admin_candidate: true // Marker for trigger/RLS if needed, though we use manual update mostly
                    }
                }
            });

            if (error) throw error;

            if (user) {
                // 2. Call the Database Function to securely upgrade to admin
                // This bypasses the RLS restriction because the function uses SECURITY DEFINER
                const { data: success, error: rpcError } = await supabase.rpc('claim_admin_access', {
                    secret_code: secretCode
                });

                if (rpcError) {
                    console.error('Promotion failed:', rpcError);
                    alert('Account created, but admin promotion failed. Please contact support.');
                } else if (!success) {
                    alert('Account created, but Secret Code was rejected by the server.');
                } else {
                    alert('Admin Account Created! You can now log in.');
                    setView('ADMIN_LOGIN');
                }
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

      return (

        <div className="flex-1 flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">

    
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-black italic tracking-tighter text-gray-900">
                        NEW ADMIN REGISTRATION
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-red-600 mb-1">Secret Code</label>
                            <input
                                type="password" // Masked
                                required
                                className="appearance-none block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                placeholder="Required for admin access"
                                value={secretCode}
                                onChange={(e) => setSecretCode(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold uppercase tracking-widest rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Register Admin'}
                        </button>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <button onClick={() => setView('ADMIN_LOGIN')} className="text-xs text-gray-500 hover:text-black underline">
                        Already have an account? Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminRegistration;
