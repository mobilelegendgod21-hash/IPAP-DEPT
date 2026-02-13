import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface ProfileProps {
    setView: (view: string) => void;
    onProfileUpdate: () => void;
}

const ProfilePage: React.FC<ProfileProps> = ({ setView, onProfileUpdate }) => {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [email, setEmail] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isUpdateConfirmOpen, setUpdateConfirmOpen] = useState(false);

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setView('LOGIN');
                return;
            }

            setEmail(user.email || '');

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`full_name, avatar_url`)
                .eq('id', user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsername(data.full_name || '');
                setAvatarUrl(data.avatar_url || '');
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop()?.toLowerCase();
            const allowedExts = ['jpg', 'jpeg', 'png'];

            if (!fileExt || !allowedExts.includes(fileExt)) {
                throw new Error('Only JPG and PNG files are allowed.');
            }

            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateClick = (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateConfirmOpen(true);
    };

    const confirmUpdate = async () => {
        try {
            setLoading(true);
            setUpdateConfirmOpen(false);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('No user logged in!');

            const updates = {
                id: user.id,
                full_name: username,
                avatar_url: avatarUrl,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) throw error;

            alert('Profile updated!');
            onProfileUpdate(); // Refresh global app state
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-8">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-black italic tracking-tighter">Your Profile</h2>
                        <p className="mt-2 text-sm text-gray-600">Update your personal details</p>
                    </div>

                    <form onSubmit={handleUpdateClick} className="space-y-6">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 overflow-hidden border-2 border-gray-100 relative">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="text"
                                value={email}
                                disabled
                                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded focus:outline-none text-gray-500 cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-400">Email cannot be changed.</p>
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                                Full Name
                            </label>
                            <input
                                id="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                                Profile Picture
                            </label>
                            <input
                                type="file"
                                id="avatar"
                                accept="image/png, image/jpeg"
                                onChange={uploadAvatar}
                                disabled={uploading}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-black hover:file:bg-gray-200 cursor-pointer"
                            />
                            <p className="mt-1 text-xs text-gray-400">
                                {uploading ? 'Uploading...' : 'Accepts JPG or PNG.'}
                            </p>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded shadow-sm text-sm font-bold uppercase tracking-widest text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center">
                        <button onClick={() => setView('HOME')} className="text-sm font-medium text-gray-600 hover:text-black hover:underline">
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isUpdateConfirmOpen}
                onClose={() => setUpdateConfirmOpen(false)}
                onConfirm={confirmUpdate}
                title="Confirm Details"
                message="Are you sure you want to update your profile information?"
            />
        </div>
    );
};

export default ProfilePage;
