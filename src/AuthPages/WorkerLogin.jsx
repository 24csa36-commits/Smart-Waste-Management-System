import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Stack, 
  TextField, 
  InputAdornment, 
  IconButton
} from '@mui/material';
import { FaTruck, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

const WorkerLogin = () => {
  const { loginUser } = useApp();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('worker@eco.com');
  const [password, setPassword] = useState('worker123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = loginUser(email, password, 'worker');
    if (res.success) {
      toast.success('Worker login successful!');
      setTimeout(() => navigate('/dashboard/worker'), 800);
    } else {
      setError(res.message);
      toast.error(res.message);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ background: 'radial-gradient(circle at 10% 20%, rgba(245,158,11,0.15) 0%, rgba(15,23,42,0.95) 90%)' }}>
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
            <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(245,158,11,0.15)', border: '2px solid #f59e0b', color: '#f59e0b' }}>
              <FaTruck size={32} />
            </div>
            <h3 className="fw-black mb-1">Worker Portal</h3>
            <p className="text-secondary fs-7 mb-0">Collection Crews & Logistics Dispatcher</p>
          </div>

          {error && (
            <div className="alert alert-danger border-0 rounded-3 text-start py-2 fs-7 mb-4" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField 
                label="Worker Email" 
                variant="outlined" 
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
                  '& label.Mui-focused': { color: '#f59e0b' },
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
                  }
                }}
              />

              <TextField 
                label="Password" 
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
                className="btn btn-warning py-3 w-100 fw-bold border-0"
                style={{ 
                  background: '#f59e0b', 
                  color: '#000',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px -4px rgba(245, 158, 11, 0.4)'
                }}
              >
                Log In as Driver
              </button>
            </Stack>
          </form>

          <div className="text-center mt-4 pt-2">
            <span className="text-muted fs-7">
              First job? Register truck: <Link to="/worker/register" style={{ color: '#f59e0b', fontWeight: 600, textDecoration: 'none' }}>Register here</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerLogin;
