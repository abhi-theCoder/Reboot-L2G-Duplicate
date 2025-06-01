import React, { useState, useEffect } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    photo: '',
    name: '',
    email: '',
    phone_calling: '',
  });
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhoto, setNewPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('Token');
  const [hasEdited, setHasEdited] = useState(false);

  useEffect(() => {
    if (!token) {
      alert('Session expired. Please log in again.');
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        const route = role == 'superadmin'? '/api/admin/profile' : '/api/agents/profile';
        const response = await axios.get(route, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        console.log(response);
      } catch (error) {
        console.error('Error fetching profile', error);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const updateProfile = async (e) => {
    e.preventDefault();
    if (!newName && !newPassword && !newPhoto) {
      setMessage('No changes made.');
      return;
    }

    try {
      const formData = new FormData();
      const updateData = {
        ...(newName && { name: newName }),
        ...(newPassword && { password: newPassword }),
      };

      if (Object.keys(updateData).length > 0) {
        formData.append('updateData', JSON.stringify(updateData));
      }

      if (newPhoto) {
        formData.append('photo', newPhoto);
      }

      const route = role == 'superadmin'? '/api/admin/profile' : '/api/agents/profile';
      await axios.put(route, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('✅ Profile updated successfully!');
      setNewName('');
      setNewPassword('');
      setNewPhoto(null);
    } catch (error) {
      console.error('Error updating profile', error);
      setMessage('❌ Error updating profile.');
    }
  };
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  return (
    <div className="w-3xl max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Your Account</h2>

      {/* Profile Photo */}
      <div className="flex justify-center mb-8">
        <img
          src={profile.photo || '/default-avatar.jpg'}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover shadow border-4 border-blue-200"
        />
      </div>

      {/* Form */}
      <form onSubmit={updateProfile} className="space-y-6">
      {message && (
          <div className="text-center mt-4 text-lg font-medium text-green-600">
            {message}
          </div>
        )}
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Full Name</label>
          <input
            type="text"
            value={hasEdited ? newName : profile.name}
            onChange={(e) => {
              setNewName(e.target.value);
              setHasEdited(true);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Email</label>
          <input
            type="text"
            value={profile.email}
            readOnly
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Phone</label>
          <input
            type="text"
            value={profile.phone_calling}
            readOnly
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Leave it blank if you do not want to change your password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Profile Photo</label>
          <input
            type="file"
            onChange={(e) => setNewPhoto(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition duration-200"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Account;
