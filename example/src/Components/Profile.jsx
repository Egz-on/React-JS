import React, { useState } from 'react';

const Profile = () => {
    const [profile, setProfile] = useState({
        name: '',
        age: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">🧍 Enter Your Profile</h1>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        name="name"
                        type="text"
                        value={profile.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        name="age"
                        type="number"
                        value={profile.age}
                        onChange={handleChange}
                        placeholder="Enter your age"
                    />
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                    <h2 className="text-lg font-semibold text-gray-700">👤 Profile Preview</h2>
                    <p className="text-gray-600 mt-2"><strong>Name:</strong> {profile.name || 'N/A'}</p>
                    <p className="text-gray-600"><strong>Age:</strong> {profile.age || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
