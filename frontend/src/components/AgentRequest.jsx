import React, { useState, useEffect } from 'react';
import ReactSwitch from 'react-switch';
import axios from '../api';
import { MessageSquare } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AgentRequests = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [currentRemarks, setCurrentRemarks] = useState('');
  const [remarksModalOpen, setRemarksModalOpen] = useState(false);
  const [remarksAgentId, setRemarksAgentId] = useState(null);

  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [parentAgentprofile, setParentAgentProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('name'); 
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('Token');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get('/api/admin/all-users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.agents || []);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const showUserData = async (id) => {
    try {
      const response = await axios.get(`/api/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
  
      // Fetch parent agent only if exists
      if (response.data.parentAgent) {
        const parentRes = await axios.get(`/api/admin/${response.data.parentAgent}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setParentAgentProfile(parentRes.data);
      } else {
        setParentAgentProfile(null);
      }
  
      setIsModalOpen(true); 
    } catch (error) {
      console.error('Failed to fetch user or parent data:', error);
    }
  };
  

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      await axios.post(
        '/api/admin/update-status',
        JSON.stringify({ userId: id, status: newStatus }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const openRemarksModal = (agentId, existingRemarks = '') => {
    setRemarksAgentId(agentId);
    setCurrentRemarks(existingRemarks);
    setRemarksModalOpen(true);
  };

  const saveRemarks = async () => {
    // console.log(currentRemarks)
    try {
      await axios.post(
        `/api/admin/agent/${remarksAgentId}/remarks`,
        JSON.stringify({ remarks: currentRemarks }),
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', } }
      );

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === remarksAgentId ? { ...user, remarks: currentRemarks } : user
        )
      );

      toast.success('Remarks saved successfully!');
      setRemarksModalOpen(false);
      setRemarksAgentId(null);
      setCurrentRemarks('');
    } catch (error) {
      console.error('Failed to save remarks:', error);
      toast.error('Failed to save remarks!');
    }
  };

  return (
    <main className="p-6 flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Agent Requests</h2>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-[rgb(30,58,138)] p-4 text-white font-semibold text-lg flex items-center">
          <i className="fas fa-list mr-2"></i> Request List
        </div>
        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder={`Search by ${filterBy}`}
          className="border rounded-md p-2 w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="border rounded-md p-2 w-full md:w-1/4"
        >
          <option value="name">Name</option>
          <option value="location">Location</option>
          <option value="phone">Phone</option>
        </select>
      </div>

        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {users
              .filter((user) => {
                if (!searchTerm) return true;
                const searchValue = searchTerm.toLowerCase();

                if (filterBy === 'name') {
                  return user.name?.toLowerCase().includes(searchValue);
                } else if (filterBy === 'location') {
                  return (
                    user.permanent_address?.village?.toLowerCase().includes(searchValue) ||
                    user.permanent_address?.district?.toLowerCase().includes(searchValue)
                  );
                } else if (filterBy === 'phone') {
                  return (
                    user.phone_calling?.includes(searchValue) ||
                    user.phone_whatsapp?.includes(searchValue)
                  );
                }
                return true;
              })
              .map((user) => (

              <div
                key={user._id}
                className="flex justify-between items-center p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center space-x-4">
                  <i className="fas fa-user text-indigo-700 text-xl"></i>
                  <div>
                    <p className="text-gray-800 font-semibold">{user.name}</p>
                    <p className="text-gray-500 text-sm">
                      Requested: {user.requestedDate || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-gray-600">
                    {/* Arriving: {user.arrivingDate || 'N/A'} */}
                  </p>
                  <ReactSwitch
                    checked={user.status === 'active'}
                    onChange={() => toggleStatus(user._id, user.status)}
                    offColor="#888"
                    onColor="#4CAF50"
                    offHandleColor="#fff"
                    onHandleColor="#fff"
                    uncheckedIcon={false}
                    checkedIcon={false}
                    height={20}
                    width={50}
                  />
                  <span className="ml-2 text-sm text-gray-600 capitalize">
                    {user.status}
                  </span> 
                  <button
                    onClick={() => showUserData(user._id)}
                    type="button"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-transform transform hover:scale-105 duration-300 cursor-pointer"
                  >
                    View
                  </button>
                  <MessageSquare
                    className="text-gray-500 hover:text-indigo-600 cursor-pointer"
                    onClick={() => openRemarksModal(user._id, user.remarks || '')}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative m-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-4 text-indigo-700 text-center">Agent Full Details</h3>

            {/* Profile Section */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={profile.photo || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
              <div className="text-center">
                <p><strong>Agent ID:</strong> {profile.agentID}</p>
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Gender:</strong> {profile.gender}</p>
                <p><strong>Date of Birth:</strong> {new Date(profile.dob).toLocaleDateString()}</p>
                <p><strong>Age:</strong> {profile.age}</p>
                <p><strong>Phone (Calling):</strong> {profile.phone_calling}</p>
                <p><strong>Phone (WhatsApp):</strong> {profile.phone_whatsapp}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Profession:</strong> {profile.profession}</p>
                <p><strong>Income:</strong> {profile.income}</p>
                <p><strong>Referral (Parent Agent ID):</strong> {parentAgentprofile?.agentID}</p>
                {parentAgentprofile && (
                  <div className="mt-2 text-sm text-gray-700 bg-gray-100 p-3 rounded-md">
                    <p><strong>Parent Name:</strong> {parentAgentprofile?.name}</p>
                    <p><strong>Parent Phone:</strong> {parentAgentprofile?.phone_calling}</p>
                    <p><strong>Parent Email:</strong> {parentAgentprofile?.email}</p>
                  </div>
                )}
              </div>
            </div>

            <hr className="my-4" />

            {/* Address Section */}
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Permanent Address</h4>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <p><strong>House No:</strong> {profile.permanent_address?.house_no}</p>
              <p><strong>Road No:</strong> {profile.permanent_address?.road_no}</p>
              <p><strong>Flat Name:</strong> {profile.permanent_address?.flat_name}</p>
              <p><strong>Pincode:</strong> {profile.permanent_address?.pincode}</p>
              <p><strong>Village:</strong> {profile.permanent_address?.village}</p>
              <p><strong>District:</strong> {profile.permanent_address?.district}</p>
              <p><strong>Thana:</strong> {profile.permanent_address?.thana}</p>
              <p><strong>Post Office:</strong> {profile.permanent_address?.post_office}</p>
            </div>

            <hr className="my-4" />

            {/* Exclusive Zones */}
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Exclusive Zones</h4>
            <div className="space-y-3 mb-4">
              {profile.exclusive_zone?.map((zone, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded">
                  <p><strong>Pincode:</strong> {zone.pincode}</p>
                  <p><strong>Village Preference:</strong> {zone.village_preference?.join(', ')}</p>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            {/* Banking Details */}
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Banking Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <p><strong>Bank Name:</strong> {profile.banking_details?.bank_name}</p>
              <p><strong>Account Holder:</strong> {profile.banking_details?.acc_holder_name}</p>
              <p><strong>Account Number:</strong> {profile.banking_details?.acc_number}</p>
              <p><strong>IFSC Code:</strong> {profile.banking_details?.ifsc_code}</p>
              <p><strong>Branch Name:</strong> {profile.banking_details?.branch_name}</p>
            </div>

            <hr className="my-4" />

            {/* Documents */}
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Documents</h4>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="text-center">
                <p className="text-sm font-semibold">Aadhaar Front</p>
                <img src={profile.aadhaarPhotoFront || 'https://via.placeholder.com/150'} alt="Aadhaar Front" className="w-24 h-24 object-cover rounded" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">Aadhaar Back</p>
                <img src={profile.aadhaarPhotoBack || 'https://via.placeholder.com/150'} alt="Aadhaar Back" className="w-24 h-24 object-cover rounded" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">PAN Card</p>
                <img src={profile.panCardPhoto || 'https://via.placeholder.com/150'} alt="PAN Card" className="w-24 h-24 object-cover rounded" />
              </div>
            </div>

          </div>
        </div>
      )}
      
      {/* {remarksModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-indigo-700">Agent Remarks</h2>
            <textarea
              value={currentRemarks}
              onChange={(e) => setCurrentRemarks(e.target.value)}
              rows={5}
              className="w-full border rounded-md p-2 mb-4"
              placeholder="Enter remarks here..."
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setRemarksModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveRemarks}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )} */}
      {remarksModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setRemarksModalOpen(false)}
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4 text-indigo-700">Agent Remarks</h3>
            <textarea
              value={currentRemarks}
              onChange={(e) => setCurrentRemarks(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded-md p-2 resize-none"
              placeholder="Write your remarks here..."
            />
            <div className="flex justify-end mt-4 space-x-8">
              <button
                onClick={() => {
                  setRemarksModalOpen(false);
                  setRemarksAgentId(null);
                  setCurrentRemarks('');
                }}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>

              <button
                onClick={saveRemarks}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default AgentRequests;
