import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Stack, 
  TextField, 
  InputAdornment, 
  IconButton
} from '@mui/material';
import { FaLeaf, FaLock, FaEnvelope, FaUser, FaEye, FaEyeSlash, FaArrowLeft, FaGoogle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

const PublicRegister = () => {
  const { registerUser, loginWithGoogle } = useApp();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setError('');
    const res = await loginWithGoogle();
    if (res.success) {
      toast.success('Registration & Login successful via Google! +100 Eco Points.');
      setTimeout(() => navigate('/dashboard/public'), 1000);
    } else {
      if (res.message && res.message.includes('popup-closed-by-user')) {
        toast.error('Login popup closed');
      } else {
        toast.error(res.message || 'Network Error');
        setError(res.message || 'Network Error');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = registerUser(name, email, password, 'public');
    if (res.success) {
      toast.success('Registration successful! +100 Eco Points awarded.');
      setTimeout(() => navigate('/dashboard/public'), 1000);
    } else {
      setError(res.message);
      toast.error(res.message);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ background: 'radial-gradient(circle at 10% 20%, rgba(6,182,212,0.15) 0%, rgba(15,23,42,0.95) 90%)' }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="container" style={{ maxWidth: '540px' }}>
        <button 
          onClick={() => navigate('/public/login')}
          className="btn btn-link text-white text-decoration-none fw-bold mb-4 d-inline-flex align-items-center gap-2"
        >
          <FaArrowLeft /> Back to Login
        </button>

        <div className="card glass-card-dark p-4 p-md-5 border-0 shadow-lg text-white">
          <div className="text-center mb-4">
            <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(6,182,212,0.15)', border: '2px solid #06b6d4', color: '#06b6d4' }}>
              <FaLeaf size={32} />
            </div>
            <h3 className="fw-black mb-1">Citizen Sign Up</h3>
            <p className="text-secondary fs-7 mb-0">Join the Smart Waste Program & Earn Vouchers</p>
          </div>

          {error && (
            <div className="alert alert-danger border-0 rounded-3 text-start py-2 fs-7 mb-4" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
              {error}
            </div>
          )}

          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="btn btn-light w-100 py-3 fs-6 fw-bold border-0 d-flex align-items-center justify-content-center gap-2 mb-4 hover-bg-light"
            style={{ borderRadius: '8px', color: '#334155', transition: 'all 0.2s' }}
          >
            <FaGoogle className="fs-5" style={{ color: '#ea4335' }} /> Continue with Google
          </button>

          <div className="d-flex align-items-center gap-3 mb-4 text-secondary fs-8">
            <hr className="flex-grow-1 border-secondary opacity-25 m-0" />
            <span className="opacity-75">OR</span>
            <hr className="flex-grow-1 border-secondary opacity-25 m-0" />
          </div>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField 
                label="Full Name" 
                variant="outlined" 
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" style={{ color: '#94a3b8' }}>
                      <FaUser />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& label': { color: '#94a3b8' },
                  '& label.Mui-focused': { color: '#06b6d4' },
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                  }
                }}
              />

              <TextField 
                label="Email Address" 
                variant="outlined" 
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" style={{ color: '#94a3b8' }}>
                      <FaEnvelope />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& label': { color: '#94a3b8' },
                  '& label.Mui-focused': { color: '#06b6d4' },
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                  }
                }}
              />

              <TextField 
                label="Create Password" 
                variant="outlined" 
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" style={{ color: '#94a3b8' }}>
                      <FaLock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} style={{ color: '#94a3b8' }}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  '& label': { color: '#94a3b8' },
                  '& label.Mui-focused': { color: '#06b6d4' },
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
                  }
                }}
              />

              <button 
                type="submit" 
                className="btn btn-info citizen-btn-primary py-3 fs-6 w-100 fw-bold border-0 text-white"
              >
                Register & Claim 100 Pts
              </button>
            </Stack>
          </form>

          <div className="text-center mt-4 pt-2">
            <span className="text-muted fs-7">
              Already registered? <Link to="/public/login" style={{ color: '#06b6d4', fontWeight: 600, textDecoration: 'none' }}>Log In here</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicRegister;
