import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Stack, 
  TextField, 
  InputAdornment
} from '@mui/material';
import { FaTruck, FaPhoneAlt, FaCommentDots, FaArrowLeft } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../firebaseConfig';

const WorkerLogin = () => {
  const { validateWorkerPhone, completeWorkerLogin } = useApp();
  const navigate = useNavigate();
  
  const [phone, setPhone] = useState('+919876543210');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Setup invisible recaptcha
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible'
        });
      } catch (err) {
        console.warn("Recaptcha verifier error (can be ignored if hot-reloading)", err);
      }
    }
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate with municipal database first
    const validation = validateWorkerPhone(phone);
    if (!validation.success) {
      setError(validation.message);
      toast.error(validation.message);
      return;
    }

    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      window.confirmationResult = confirmationResult;
      setShowOtpInput(true);
      toast.success('OTP sent successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to send OTP. Check your Firebase config.');
      toast.error('Failed to send OTP.');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const confirmationResult = window.confirmationResult;
      await confirmationResult.confirm(otp);
      
      // Get worker details from database since they are verified
      const validation = validateWorkerPhone(phone);
      completeWorkerLogin(validation.worker);
      
      toast.success('Worker Verification Successful!');
      setTimeout(() => navigate('/dashboard/worker'), 800);
    } catch (err) {
      console.error(err);
      setError('Invalid verification code.');
      toast.error('Invalid verification code.');
    }
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ background: 'radial-gradient(circle at 10% 20%, rgba(245,158,11,0.15) 0%, rgba(15,23,42,0.95) 90%)' }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <div id="recaptcha-container"></div>
      <div className="container" style={{ maxWidth: '540px' }}>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-link text-white text-decoration-none fw-bold mb-4 d-inline-flex align-items-center gap-2"
        >
          <FaArrowLeft /> Back to Hub
        </button>

        <div className="card glass-card-dark p-4 p-md-5 border-0 shadow-lg text-white">
          <div className="text-center mb-4">
            <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(245,158,11,0.15)', border: '2px solid #f59e0b', color: '#f59e0b' }}>
              <FaTruck size={32} />
            </div>
            <h3 className="fw-black mb-1">Worker Portal</h3>
            <p className="text-secondary fs-7 mb-0">Secure Mobile Authentication</p>
          </div>

          {error && (
            <div className="alert alert-danger border-0 rounded-3 text-start py-2 fs-7 mb-4" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
              {error}
            </div>
          )}

          {!showOtpInput ? (
            <form onSubmit={handleSendOtp}>
              <Stack spacing={3}>
                <TextField 
                  label="Mobile Number (with country code)" 
                  variant="outlined" 
                  fullWidth
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" style={{ color: '#94a3b8' }}>
                        <FaPhoneAlt />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& label': { color: '#94a3b8' },
                    '& label.Mui-focused': { color: '#f59e0b' },
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
                    }
                  }}
                />

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-warning py-3 w-100 fw-bold border-0"
                  style={{ 
                    background: '#f59e0b', 
                    color: '#000',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px -4px rgba(245, 158, 11, 0.4)'
                  }}
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </Stack>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <Stack spacing={3}>
                <TextField 
                  label="Verification Code (OTP)" 
                  variant="outlined" 
                  fullWidth
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" style={{ color: '#94a3b8' }}>
                        <FaCommentDots />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& label': { color: '#94a3b8' },
                    '& label.Mui-focused': { color: '#f59e0b' },
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
                    }
                  }}
                />

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-success py-3 w-100 fw-bold border-0"
                  style={{ 
                    background: '#10b981', 
                    color: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </Stack>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default WorkerLogin;
