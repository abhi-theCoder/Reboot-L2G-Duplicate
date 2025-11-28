import React, { useState } from 'react';
import axios from '../api';
import { Mail, Key, Lock, ArrowLeft } from 'lucide-react'; 

// Note: API_BASE_URL is not needed here as the paths are absolute (e.g., /api/otp/send-otp)

const steps = [
  { id: 1, name: 'Enter Email', icon: Mail },
  { id: 2, name: 'Verify OTP', icon: Key },
  { id: 3, name: 'Reset Password', icon: Lock },
];

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Custom State to match user's provided logic names
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false); // Used for Step 3: Reset Password
  const [errors, setErrors] = useState({});

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleBack = () => {
    if (step === 2) {
        setStep(1);
        setOtp('');
        setMessage({ type: '', text: '' }); 
    }
  };


  // --- STEP 1: Send OTP ---
  const handleSendOtp = async (e) => {
    e?.preventDefault(); // Only prevent default if triggered by a form submission
    setIsSendingOtp(true);
    setMessage({ type: '', text: '' });
    setErrors({});

    try {
      if (!email) {
        setErrors(prev => ({ ...prev, email: "Please enter a valid email address first." }));
        setIsSendingOtp(false);
        return;
      }
      
      // API call to request OTP for the given email using the new endpoint
      await axios.post('/api/otp/send-otp', { email, forgot_password:"true" }, {
        headers: { "Content-Type": "application/json" }
      });
      
      showMessage('success', 'OTP sent successfully to your email!');
      setStep(2);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send OTP. Try again.";
      showMessage('error', errorMessage);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // --- STEP 2: Verify OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setMessage({ type: '', text: '' });
    setErrors({});

    if (otp.length !== 6) {
        showMessage('error', 'Please enter a 6-digit code.');
        setIsVerifying(false);
        return;
    }
    
    try {
      // API call to verify the OTP using the new endpoint
      await axios.post('/api/otp/verify-otp', { email, otp }, {
        headers: { "Content-Type": "application/json" }
      });
      
      showMessage('success', 'OTP verified. You can now reset your password.');
      setStep(3);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "OTP verification failed. Please check the code.";
      showMessage('error', errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  // --- STEP 3: Reset Password ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setErrors({});

    if (newPassword !== confirmPassword) {
      showMessage('error', 'Passwords do not match.');
      setLoading(false);
      return;
    }
    
    if (newPassword.length < 8) {
        showMessage('error', 'Password must be at least 8 characters long.');
        setLoading(false);
        return;
    }

    try {
      // API call to reset the password
      const response = await axios.post('/api/otp/reset-password', { email, otp, newPassword }, {
        headers: { "Content-Type": "application/json" }
      });

      showMessage('success', response.data.message || 'Password successfully reset! You can now log in.');

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please ensure the code is still valid.';
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- Step Indicator Component ---
  const StepIndicator = ({ currentStep }) => (
    <nav aria-label="Progress" className="mb-8 w-full">
      <ol role="list" className="flex items-center justify-between space-x-2 md:space-x-8">
        {steps.map((s) => (
          <li key={s.id} className="flex-1">
            {/* Step Checkpoint */}
            <div className={`flex flex-col items-center group ${s.id < currentStep ? 'cursor-default' : 'cursor-default'}`}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full text-white transition-colors duration-300 
                ${s.id === currentStep ? 'bg-indigo-600 ring-4 ring-indigo-200' : 
                   s.id < currentStep ? 'bg-green-500' : 
                   'bg-gray-300'}`}>
                <s.icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className={`mt-2 text-xs font-medium text-center ${s.id === currentStep ? 'text-indigo-600' : 'text-gray-500'} hidden sm:block`}>
                {s.name}
              </p>
            </div>
            {/* Divider Line (not for the last step) */}
            {s.id < steps.length && (
                <div className={`w-full h-1 -mt-5 -z-10 ${s.id < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
  
  // --- Render Functions for Each Step ---

  const renderStep1 = () => (
    <form onSubmit={handleSendOtp} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">1. Account Verification</h2>
      <p className="text-sm text-gray-500">
        Enter the email address associated with your account to receive a 6-digit verification code.
      </p>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
        <div className="mt-1">
            <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSendingOtp}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <button
        type="submit"
        disabled={isSendingOtp || !email}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:bg-indigo-300"
      >
        {isSendingOtp ? 'Sending Code...' : 'Send Verification Code'}
      </button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-6">
        <button 
            type="button" 
            onClick={handleBack} 
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition duration-150 mb-4"
            disabled={isVerifying}
        >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Email
        </button>
      <h2 className="text-2xl font-bold text-gray-900">2. Enter Verification Code</h2>
      <p className="text-sm text-gray-500">
        We sent a code to <span className="font-semibold text-indigo-600">{email}</span>. Please check your inbox.
      </p>

      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">6-Digit Code</label>
        <div className="mt-1">
            <input
                id="otp"
                type="text"
                placeholder="e.g., 123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                maxLength="6"
                required
                disabled={isVerifying}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-center tracking-widest text-lg font-mono focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
        </div>
      </div>
      
      <div className="flex flex-col space-y-3">
        <button
            type="submit"
            disabled={isVerifying || otp.length !== 6}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:bg-indigo-300"
        >
            {isVerifying ? 'Verifying...' : 'Verify Code & Continue'}
        </button>
        <button 
            type="button" 
            onClick={handleSendOtp} 
            disabled={isSendingOtp || isVerifying}
            className="w-full py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition duration-150 disabled:bg-gray-100"
        >
            {isSendingOtp ? 'Sending...' : 'Resend Code'}
        </button>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">3. Set New Password</h2>
      <p className="text-sm text-gray-500">
        You're almost done! Create a strong, new password for your account.
      </p>
      
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password (Min 8 Chars)</label>
        <div className="mt-1">
            <input
                id="newPassword"
                type="password"
                placeholder="********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <div className="mt-1">
            <input
                id="confirmPassword"
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !newPassword || newPassword !== confirmPassword}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:bg-indigo-300"
      >
        {loading ? 'Updating...' : 'Reset Password'}
      </button>
    </form>
  );

  return (
    <div className="relative flex items-start justify-center min-h-screen p-4 sm:p-6 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 custom-animate-xy filter blur-3xl opacity-50"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 via-green-500 to-teal-500 custom-animate-xy-reverse filter blur-3xl opacity-50"></div>

      {/* Content Container (z-index ensures it's above the background) */}
      <div className="relative z-10 w-full max-w-md mt-10 bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Forgot Your Password?
          </h1>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Dynamic Message Display */}
        {message.text && (
          <div className={`p-3 rounded-lg text-sm font-medium mb-4 transition-all duration-300 ${
            message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 
            'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Render current step form */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>

      {/* Custom CSS for Animations - fully self-contained */}
      <style>{`
        @keyframes gradient-xy {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
        @keyframes gradient-xy-reverse {
            0% {
              background-position: 100% 100%;
            }
            50% {
              background-position: 0% 0%;
            }
            100% {
              background-position: 100% 100%;
            }
        }
        .custom-animate-xy {
          background-size: 400% 400%;
          animation: gradient-xy 30s ease infinite;
        }
        .custom-animate-xy-reverse {
            background-size: 400% 400%;
            animation: gradient-xy-reverse 30s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordPage;