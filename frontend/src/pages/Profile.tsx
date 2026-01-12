import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ProfileForm from '../components/profile/ProfileForm';
import AddressManager from '../components/profile/AddressManager';

export default function Profile() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'addresses'>('details');

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
            <h5 className="text-accent mb-2">My Account</h5>
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold">Profile Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
                <nav className="space-y-1">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === 'details' ? 'bg-secondary text-accent font-medium shadow-sm' : 'text-muted hover:bg-secondary/50 hover:text-text'}`}
                    >
                        Personal Details
                    </button>
                    <button
                        onClick={() => setActiveTab('addresses')}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === 'addresses' ? 'bg-secondary text-accent font-medium shadow-sm' : 'text-muted hover:bg-secondary/50 hover:text-text'}`}
                    >
                        Address Book
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
                {activeTab === 'details' ? <ProfileForm /> : <AddressManager />}
            </div>
        </div>
      </div>
    </div>
  );
}
