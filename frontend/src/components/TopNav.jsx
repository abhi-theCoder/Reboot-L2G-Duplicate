import React, { useEffect, useState } from 'react';
import axios from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoon as faMoonRegular,
  faQuestionCircle as faQuestionCircleRegular,
  faBell as faBellRegular,
} from '@fortawesome/free-regular-svg-icons';

function TopNav({ collapsed }) {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState(null);
  const [inactiveCount, setInactiveCount] = useState(0);
  
  const token = localStorage.getItem('Token'); 
  const role = localStorage.getItem('role');  

  const fetchProfile = async () => {
    try {
      const route = role === 'superadmin' || role === 'admin' ? '/api/admin/profile' : '/api/agents/profile';
      
      
      const res = await axios.get(route, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          role,
        },
      });
      // console.log(res);
      setProfile(res.data);
    } catch (err) {
      setMessage({
        text: 'Error: ' + (err.response?.data?.error || 'Failed to fetch profile'),
        type: 'error',
      });
    }
  };
  
  
   useEffect(() => {
    fetchProfile();
  }, []);

 if(role == 'superadmin'){
  useEffect(() => {
    const fetchInactiveUsers = async () => {
      try {
        const res = await axios.get('/api/admin/inactive-count', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setInactiveCount(res.data.count);
      } catch (error) {
        console.error('Failed to fetch inactive user count:', error);
      }
    };
    fetchInactiveUsers();
    const intervalId = setInterval(fetchInactiveUsers, 2000);
    return () => clearInterval(intervalId);
  }, []);
 }
 const copyToClipboard = () => {
  if (profile?._id) {
    navigator.clipboard.writeText(profile._id);
    alert("Referral code copied to clipboard!");
  }
};
  return (
    <nav className="bg-white p-4 flex justify-between items-center shadow-md pl-10">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Hi {profile?.name || 'User'}</h1>
        {profile?._id && role !== 'superadmin' && (
          <div className="text-sm text-gray-600 mt-1">
            Your Referral Code: 
            <span 
              className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
              onClick={copyToClipboard}
              title="Click to copy"
             >
              {profile._id}
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
      <h2 className="text-lg font-bold text-gray-800 bg-gray-100 rounded p-2"> 💳 wallet: {profile?.walletBalance || 0}</h2>
        <button className="bg-gray-100 p-2 rounded-full">
          <FontAwesomeIcon icon={faMoonRegular} />
        </button>
        <button className="bg-gray-100 p-2 rounded-full">
          <FontAwesomeIcon icon={faQuestionCircleRegular} />
        </button>
        <button className="bg-gray-100 p-2 rounded-full relative">
          <FontAwesomeIcon icon={faBellRegular} />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {inactiveCount}
          </span>
        </button>
        <img
          src={profile?.photo || "https://randomuser.me/api/portraits/women/44.jpg"}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </nav>
  );
}

export default TopNav;
