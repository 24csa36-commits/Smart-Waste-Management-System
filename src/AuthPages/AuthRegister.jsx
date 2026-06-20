import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const AuthRegister = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ background: 'radial-gradient(circle at 10% 20%, rgba(16,185,129,0.15) 0%, rgba(15,23,42,0.95) 90%)' }}>
      <div className="container" style={{ maxWidth: '540px' }}>
        <button 
          onClick={() => navigate('/auth/login')}
          className="btn btn-link text-white text-decoration-none fw-bold mb-4 d-inline-flex align-items-center gap-2"
        >
          <FaArrowLeft /> Back to Login
        </button>

        <div className="card glass-card-dark p-4 p-md-5 border-0 shadow-lg text-white text-center">
          <div className="text-center mb-4">
            <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(245,158,11,0.15)', border: '2px solid #f59e0b', color: '#f59e0b' }}>
              <FaExclamationTriangle size={32} />
            </div>
            <h3 className="fw-black mb-1">Access Restricted</h3>
            <p className="text-secondary fs-7 mb-0">Authority Account Provisioning</p>
          </div>

          <p className="text-secondary fs-6 mb-4 lh-base">
            Authority registrations must be provisioned internally by the Municipal IT Services team. Public self-registration is disabled to preserve system safety and prevent database alterations.
          </p>

          <div className="card border-0 p-3 mb-4 text-start" style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.12)' }}>
            <span className="fw-bold text-success fs-7 d-block mb-1">
              <FaUserShield /> Pre-Provisioned Admin Login:
            </span>
            <span className="d-block fs-8 text-secondary font-monospace">Email: admin@municipal.gov</span>
            <span className="d-block fs-8 text-secondary font-monospace">Password: admin123</span>
          </div>

          <button 
            onClick={() => navigate('/auth/login')}
            className="btn btn-success eco-btn-primary py-3 fs-6 w-100 fw-bold border-0"
          >
            Go to Authority Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthRegister;
