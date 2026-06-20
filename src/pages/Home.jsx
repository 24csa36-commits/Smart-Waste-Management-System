import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaTruck, 
  FaUserShield, 
  FaLeaf, 
  FaGlobeAmericas, 
  FaServer, 
  FaChartLine 
} from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  const portalCards = [
    {
      title: 'Municipal Authority Portal',
      subtitle: 'For Administrators & Managers',
      description: 'Monitor IoT bin capacities, optimize collection routes in real-time, dispatch workers, resolve public complaints, and view comprehensive environmental analytics.',
      icon: <FaUserShield size={36} className="text-success" />,
      loginPath: '/auth/login',
      registerPath: '/auth/register',
      colorClass: 'text-success',
      borderClass: 'border-success-subtle',
      btnClass: 'btn-success eco-btn-primary'
    },
    {
      title: 'Public Citizen Portal',
      subtitle: 'For Smart Citizens & Recyclers',
      description: 'Locate nearby smart bins, check container fill status before leaving home, report overflowing waste dumps, log recyclables to earn reward vouchers.',
      icon: <FaLeaf size={36} className="text-info" />,
      loginPath: '/public/login',
      registerPath: '/public/register',
      colorClass: 'text-info',
      borderClass: 'border-info-subtle',
      btnClass: 'btn-info citizen-btn-primary'
    },
    {
      title: 'Collection Worker Portal',
      subtitle: 'For Field Officers & Drivers',
      description: 'Access mobile-optimized collection check-lists, view turn-by-turn route maps to overflowing bins, log collections, and report damaged infrastructure.',
      icon: <FaTruck size={36} className="text-warning" />,
      loginPath: '/worker/login',
      registerPath: '/worker/register',
      colorClass: 'text-warning',
      borderClass: 'border-warning-subtle',
      btnClass: 'btn-warning bg-warning-subtle text-dark border-warning'
    }
  ];

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)' }}>
      
      {/* Bootstrap Glass Header */}
      <nav className="navbar navbar-expand-lg border-bottom sticky-top" style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)' }}>
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2 fw-extrabold text-gradient-eco fs-4" href="#">
            <FaGlobeAmericas size={26} className="text-success" />
            <span className="fw-bold tracking-tight">EcoSmart Waste</span>
          </a>
          <span className="navbar-text text-secondary fw-semibold fs-7">
            Live Eco-System Monitor v1.5
          </span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container my-auto py-5">
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-start">
              <motion.div variants={itemVariants}>
                <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold uppercase tracking-wider mb-3">
                  IoT Driven Urban Cleanliness
                </span>
                <h1 className="display-4 fw-black text-slate-900 lh-sm mb-3">
                  Smart Waste Management <br />
                  <span className="text-gradient-eco fw-extrabold">For Modern Cities</span>
                </h1>
                <p className="lead text-secondary mb-4 fs-5" style={{ maxWidth: '620px' }}>
                  A unified simulation hub integrating smart IoT sensors, route optimization, citizen reporting, and worker dispatcher schedules for zero-waste communities.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="d-flex flex-column flex-sm-row gap-3">
                <button 
                  className="btn eco-btn-primary px-4 py-3"
                  onClick={() => {
                    const el = document.getElementById('gateways');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Enter Application Hub
                </button>
                <button 
                  className="btn btn-outline-secondary border-secondary-subtle px-4 py-3 fw-bold rounded-3"
                  onClick={() => navigate('/public/login')}
                >
                  Citizen Quick Access
                </button>
              </motion.div>
            </div>

            {/* Impact Metrics Card */}
            <div className="col-lg-5">
              <motion.div variants={itemVariants}>
                <div className="card glass-card p-4 text-start shadow-sm border-0">
                  <h5 className="fw-bold text-slate-900 mb-4">
                    Live Environmental Impact
                  </h5>
                  <div className="d-flex flex-column gap-4">
                    
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-3 bg-success-subtle text-success rounded-3">
                        <FaServer size={22} />
                      </div>
                      <div>
                        <span className="text-muted fs-7 d-block">Connected IoT Trash Bins</span>
                        <strong className="fs-5 text-slate-800">6 Active Nodes</strong>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <div className="p-3 bg-info-subtle text-info rounded-3">
                        <FaChartLine size={22} />
                      </div>
                      <div>
                        <span className="text-muted fs-7 d-block">Average Trash Density</span>
                        <strong className="fs-5 text-slate-800">60.1% fill-rate</strong>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <div className="p-3 bg-warning-subtle text-warning rounded-3">
                        <FaLeaf size={22} />
                      </div>
                      <div>
                        <span className="text-muted fs-7 d-block">Total Carbon Diverted</span>
                        <strong className="fs-5 text-slate-800">4.8 Tons CO₂</strong>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Gateways Section */}
      <div className="bg-white border-top py-5" id="gateways" style={{ scrollMarginTop: '80px' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-extrabold text-slate-900 mb-2">Choose Your Gateway Portal</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '580px' }}>
              Select one of our simulated portals below to test out the responsive interface, manage resources, log works, or earn point credits.
            </p>
          </div>

          <div className="row g-4">
            {portalCards.map((portal, index) => (
              <div className="col-md-4" key={index}>
                <motion.div 
                  className="card h-100 glass-card p-3 border-0 text-start d-flex flex-column justify-content-between"
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 260 }}
                >
                  <div className="card-body p-3">
                    <div className="mb-3 d-inline-block p-2 bg-light rounded-3">
                      {portal.icon}
                    </div>
                    <h5 className="card-title fw-extrabold text-slate-900 mb-1">{portal.title}</h5>
                    <h6 className={`card-subtitle mb-3 fw-bold fs-7 ${portal.colorClass}`}>{portal.subtitle}</h6>
                    <p className="card-text text-secondary fs-7 lh-base">{portal.description}</p>
                  </div>
                  
                  <div className="p-3 d-grid gap-2 border-top mt-3 bg-transparent">
                    <button 
                      className={`btn fw-bold py-2 ${portal.btnClass}`}
                      onClick={() => navigate(portal.loginPath)}
                    >
                      Enter Portal (Login)
                    </button>
                    <button 
                      className="btn btn-link text-decoration-none text-muted fw-bold fs-7"
                      onClick={() => navigate(portal.registerPath)}
                    >
                      New Account (Register)
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Credentials Panel */}
      <div className="container my-5">
        <div className="card p-4 border border-slate-100 shadow-sm rounded-4 text-start">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <h5 className="fw-extrabold text-slate-900 mb-2">Quick Test Credentials</h5>
              <p className="text-muted fs-7 mb-4">Skip registration! Use these pre-loaded simulated accounts to instantly view data panels:</p>
              
              <div className="row g-3">
                <div className="col-sm-4">
                  <div className="p-3 bg-light border border-dashed rounded-3">
                    <span className="fw-bold text-success fs-7 d-block mb-1">Authority Admin</span>
                    <span className="d-block fs-8 text-secondary">User: <b>admin@municipal.gov</b></span>
                    <span className="d-block fs-8 text-secondary">Pass: <b>admin123</b></span>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="p-3 bg-light border border-dashed rounded-3">
                    <span className="fw-bold text-info fs-7 d-block mb-1">Citizen Public</span>
                    <span className="d-block fs-8 text-secondary">User: <b>citizen@eco.com</b></span>
                    <span className="d-block fs-8 text-secondary">Pass: <b>citizen123</b></span>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="p-3 bg-light border border-dashed rounded-3">
                    <span className="fw-bold text-warning fs-7 d-block mb-1">Field Driver</span>
                    <span className="d-block fs-8 text-secondary">User: <b>worker@eco.com</b></span>
                    <span className="d-block fs-8 text-secondary">Pass: <b>worker123</b></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 text-center border-start">
              <span className="text-muted fs-7 d-block mb-1">Eco Impact Rating</span>
              <span className="display-4 fw-extrabold text-success">A+</span>
              <span className="text-muted fs-7 d-block mt-2">Landfill diversion currently at <b>91.5%</b>.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
