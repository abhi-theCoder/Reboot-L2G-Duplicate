import React, { useState } from 'react';
import axios from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import MainLogo from '../../public/main-logo.png'; // Import your logo image

function AgentLogin({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    role: 'user',
    securityKey: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showMessage, setShowMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  useEffect(() => {
    if (message.text) {
      setShowMessage(true);
      const hideTimer = setTimeout(() => {
        setShowMessage(false);
      }, 2500);
      const clearTimer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
      return () => {
        clearTimeout(hideTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [message]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const payload = {
        identifier: formData.identifier,
        password: formData.password,
        // isAdmin: formData.role === 'admin',
        // securityKey: formData.role === 'admin' ? formData.securityKey : undefined
      };

      const response = await axios.post("/api/agents/login", payload, {
        headers: { "Content-Type": "application/json" }
      });

      setMessage({ text: 'Login Successful!', type: 'success' });
      setTimeout(() => {
        localStorage.setItem('Token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('agentID', response.data.agentID);
        // console.log(response.data);
        
        setIsAuthenticated(true);

        if (response.data.role === 'superadmin') {
          navigate("/superadmin/dashboard");
        } else {
          navigate("/agent/dashboard");
        }
      }, 1000);

    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setMessage({ text: error.response?.data?.error || 'Login failed!', type: 'error' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-10 space-y-8">
        <span className='main_logo block text-center -mt-[90px]'><img src={MainLogo} alt=""  className='inline-block bg-white p-4 rounded-full border border-gray-200 shadow-md'/></span>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Sign In</h2>
        <form
          onSubmit={handleSubmit}

        >

          {message.text && (
            <div
              className={`text-sm px-4 py-3 rounded-md mb-4 transition-opacity duration-500 ${showMessage ? 'opacity-100' : 'opacity-0'
                } ${message.type === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
                }`}
            >
              {message.text}
            </div>
          )}

          {/* Identifier Input */}
          <div className="space-y-1 mb-6">
            <label htmlFor="identifier" className="text-sm font-medium text-gray-700 mb-2 block">
              Email or Phone
            </label>
            <input
              type="text"
              name="identifier"
              id="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1 relative mb-6">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-[59%] transform -translate-y-1/2 !bg-transparent !p-0 !text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transition duration-300"
          >
            Login
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-blue-700 hover:underline font-medium">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>


  );
}

export default AgentLogin;