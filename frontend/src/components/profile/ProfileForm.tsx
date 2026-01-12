import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Upload, Save, User as UserIcon } from 'lucide-react';
import api from '../../lib/api';

export default function ProfileForm() {
    const { user, updateAuthUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [preview, setPreview] = useState(user?.avatar || '');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        try {
            const response = await api.post('/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            updateAuthUser(response.data.user);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-secondary border border-glass-border rounded-lg p-6">
            <h2 className="text-2xl font-serif mb-6">Personal Details</h2>

            {message.text && (
                <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center sm:items-start gap-4 mb-6">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-tertiary">
                        {preview ? (
                             <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted">
                                <UserIcon size={40} />
                            </div>
                        )}
                    </div>
                    <div>
                        <input
                            type="file"
                            id="avatar"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                        <label
                            htmlFor="avatar"
                            className="btn-outline text-xs py-2 px-4 cursor-pointer flex items-center gap-2"
                        >
                            <Upload size={14} /> Change Avatar
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm text-muted uppercase tracking-wider">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-muted uppercase tracking-wider">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={isLoading} className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
