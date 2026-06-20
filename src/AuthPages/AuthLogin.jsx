import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  InputAdornment, 
  IconButton,
  Alert
} from '@mui/material';
import { FaUserShield, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

const AuthLogin = () => {
  const { loginUser } = useApp();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('admin@municipal.gov');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = loginUser(email, password, 'authority');
    if (res.success) {
      toast.success('Admin login successful!');
      setTimeout(() => navigate('/dashboard/authority'), 800);
    } else {
      setError(res.message);
      toast.error(res.message);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ background: 'radial-gradient(circle at 10% 20%, rgba(16,185,129,0.15) 0%, rgba(15,23,42,0.95) 90%)' }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="container" style={{ maxWidth: '540px' }}>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-link text-white text-decoration-none fw-bold mb-4 d-inline-flex align-items-center gap-2"
        >
          <FaArrowLeft /> Back to Hub
        </button>

        <div className="card glass-card-dark p-4 p-md-5 border-0 shadow-lg text-white">
          <div className="text-center mb-4">
            <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid #10b981', color: '#10b981' }}>
              <FaUserShield size={32} />
            </div>
            <h3 className="fw-black mb-1">Authority Portal</h3>
            <p className="text-secondary fs-7 mb-0">Municipal Waste Control Center</p>
          </div>

          {error && (
            <div className="alert alert-danger border-0 rounded-3 text-start py-2 fs-7 mb-4" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField 
                label="Admin Email Address" 
                variant="outlined" 
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" style={{ color: '#94a3b8' }}>
                      <FaUserShield />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& label': { color: '#94a3b8' },
                  '& label.Mui-focused': { color: '#10b981' },
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                  }
                }}
              />

              <TextField 
                label="Access Password" 
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
                  '& label.Mui-focused': { color: '#10b981' },
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' },
                  }
                }}
              />

              <button 
                type="submit" 
                className="btn btn-success eco-btn-primary py-3 fs-6 w-100 fw-bold border-0"
              >
                Log In as Administrator
              </button>
            </Stack>
          </form>

          <div className="text-center mt-4 pt-2">
            <span className="text-muted fs-7">
              Want to see registration? <Link to="/auth/register" style={{ color: '#10b981', fontWeight: 600, textDecoration: 'none' }}>View Info</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
