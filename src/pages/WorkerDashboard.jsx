import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Box, 
  Stack, 
  LinearProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  FaSignOutAlt, 
  FaTruck, 
  FaList, 
  FaMapMarkedAlt, 
  FaExclamationTriangle, 
  FaCheck, 
  FaWrench,
  FaCalendarCheck,
  FaShieldAlt
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { toast, ToastContainer } from 'react-toastify';

// Custom dot marker icon for Leaflet
const getWorkerMarkerIcon = (fillLevel) => {
  let color = '#f59e0b'; // Amber
  if (fillLevel >= 80) color = '#ef4444'; // Red

  return new L.DivIcon({
    html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-worker-bin-marker',
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, bins, complaints, laborers, logoutUser, completeCollection, addComplaint, resolveComplaintTask } = useApp();

  const [activeTab, setActiveTab] = useState(0);

  const [photoUpload, setPhotoUpload] = useState(false);

  // Issue/Hazard Form State
  const [hazardTitle, setHazardTitle] = useState('');
  const [hazardDesc, setHazardDesc] = useState('');
  const [hazardBinId, setHazardBinId] = useState('');
  const [hazardType, setHazardType] = useState('General');

  const assignedBinIds = currentUser?.route || [];
  const routeBins = bins.filter(b => assignedBinIds.includes(b.id));

  // Sort route bins to make path logical (sequential by index in worker route)
  const orderedRouteBins = [...routeBins].sort((a, b) => assignedBinIds.indexOf(a.id) - assignedBinIds.indexOf(b.id));

  // Coordinates array for drawing route polyline
  const routeCoords = orderedRouteBins.map(b => [b.lat, b.lng]);

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleEmptyBin = (binId, binName) => {
    completeCollection(currentUser.email, binId);
    toast.success(`Bin ${binId} (${binName}) successfully emptied! Fill status reset to 0%.`);
  };

  const handleHazardSubmit = (e) => {
    e.preventDefault();
    if (!hazardTitle || !hazardDesc) {
      toast.error('Please enter hazard title and description');
      return;
    }

    let lat = 11.0168;
    let lng = 76.9558;
    if (hazardBinId) {
      const b = bins.find(item => item.id === hazardBinId);
      if (b) {
        lat = b.lat;
        lng = b.lng;
      }
    }

    addComplaint(`[Worker Alert] ${hazardTitle}`, hazardDesc, lat, lng, hazardType, currentUser.email);
    toast.success('Hazard reported to municipal control!');
    
    setHazardTitle('');
    setHazardDesc('');
    setHazardBinId('');
    setHazardType('General');
    setActiveTab(0);
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column flex-md-row p-0 bg-light">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Sidebar Nav using Bootstrap list group & custom dark style */}
      <div className="col-12 col-md-3 col-lg-2.5 bg-dark text-white p-4 d-flex flex-column justify-content-between border-end border-secondary" style={{ minWidth: '240px' }}>
        <div>
          <div className="d-flex align-items-center gap-2 mb-5">
            <FaTruck size={24} className="text-warning" />
            <h5 className="fw-black mb-0 text-gradient-worker text-uppercase">Worker Hub</h5>
          </div>

          <div className="list-group list-group-flush gap-2">
            {[
              { id: 0, label: 'My Active Route', icon: <FaList /> },
              { id: 3, label: 'Assigned Tasks', icon: <FaShieldAlt /> },
              { id: 2, label: 'Shift Stats', icon: <FaCalendarCheck /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`list-group-item list-group-item-action bg-transparent text-start border-0 py-3 px-3 rounded-3 d-flex align-items-center gap-3 fs-7 fw-semibold ${activeTab === tab.id ? 'text-warning bg-secondary-subtle fw-bold' : 'text-secondary'}`}
                style={{ transition: 'all 0.2s' }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-5 mt-auto">
          <div className="card bg-secondary-subtle border-0 p-3 mb-3 text-start text-white-50">
            <span className="fs-8 d-block mb-1 text-muted">Assigned Driver</span>
            <strong className="fs-7 text-white text-truncate d-block">{currentUser?.name || 'Worker'}</strong>
            <span className="fs-8 text-warning fw-semibold mt-1 d-block">{currentUser?.truck || 'Truck ID'}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold fs-7"
            style={{ borderRadius: '8px' }}
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="col-12 col-md px-4 py-4 d-flex flex-column custom-scroll" style={{ overflowY: 'auto', height: '100vh' }}>
        
        {/* TAB 0: MY ACTIVE ROUTE */}
        {activeTab === 0 && (
          <div className="text-start">
            <h2 className="fw-black text-slate-900 mb-1">Active Route Logistics</h2>
            <p className="text-muted fs-7 mb-4">Complete waste collections at your assigned smart containers in sequence.</p>

            <div className="row g-4">
              {/* Checklist Collection */}
              <div className="col-lg-5">
                <div className="card glass-card p-4 border-0 shadow-sm text-start" style={{ minHeight: '420px' }}>
                  <h6 className="fw-extrabold text-slate-800 mb-4 d-flex align-items-center gap-2">
                    <FaList className="text-warning" /> Route Checklist ({orderedRouteBins.length} Bins)
                  </h6>

                  <div className="d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: '420px' }}>
                    {orderedRouteBins.map((bin, index) => (
                      <div key={bin.id} className="p-3 border rounded-3 bg-white shadow-xs">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <strong className="fs-7 text-slate-800 d-block">
                              {index + 1}. {bin.name}
                            </strong>
                            <span className="fs-8 text-muted">
                              ID: {bin.id} | Type: {bin.type} | Cap: {bin.capacity}L
                            </span>
                          </div>
                          <span className={`badge px-2 py-1.5 fs-8 rounded-pill fw-bold ${bin.fillLevel >= 80 ? 'bg-danger-subtle text-danger' : bin.fillLevel >= 50 ? 'bg-warning-subtle text-warning-emphasis' : 'bg-success-subtle text-success'}`}>
                            {bin.fillLevel}%
                          </span>
                        </div>

                        <div className="progress mb-3" style={{ height: '5px' }}>
                          <div 
                            className={`progress-bar ${bin.fillLevel >= 80 ? 'bg-danger' : bin.fillLevel >= 50 ? 'bg-warning' : 'bg-success'}`}
                            role="progressbar" 
                            style={{ width: `${bin.fillLevel}%` }}
                          />
                        </div>

                        <button 
                          onClick={() => handleEmptyBin(bin.id, bin.name)}
                          className="btn btn-success btn-sm w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                          style={{ borderRadius: '6px' }}
                        >
                          <FaCheck /> Mark Emptied
                        </button>
                      </div>
                    ))}

                    {orderedRouteBins.length === 0 && (
                      <div className="text-center py-5">
                        <FaCheck size={48} className="text-success mb-3" />
                        <strong className="fs-6 text-slate-800 d-block">Route Completed!</strong>
                        <span className="fs-8 text-muted d-block mt-1">No bins are currently assigned. Contact municipal control for dispatch.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Route Map with polyline direction */}
              <div className="col-lg-7">
                <div className="card glass-card p-4 border-0 shadow-sm d-flex flex-column" style={{ height: '480px' }}>
                  <h6 className="fw-extrabold text-slate-800 mb-3 d-flex align-items-center gap-2">
                    <FaMapMarkedAlt className="text-warning" /> Route Navigation Map
                  </h6>
                  
                  <div className="flex-grow-1 position-relative rounded-3 border overflow-hidden shadow-xs" style={{ minHeight: '320px' }}>
                    <MapContainer center={[11.0168, 76.9558]} zoom={13} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
                      />
                      {orderedRouteBins.map(bin => (
                        <Marker 
                          key={bin.id} 
                          position={[bin.lat, bin.lng]} 
                          icon={getWorkerMarkerIcon(bin.fillLevel)}
                        >
                          <Popup>
                            <div className="p-1 text-start">
                              <strong className="fs-7 d-block">{bin.name}</strong>
                              <span className="fs-8 text-muted">Fill: {bin.fillLevel}%</span>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                      {routeCoords.length > 1 && (
                        <Polyline 
                          positions={routeCoords} 
                          color="#f59e0b" 
                          weight={4} 
                          dashArray="8, 8"
                          opacity={0.8}
                        />
                      )}
                    </MapContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* TAB 2: SHIFT STATS */}
        {activeTab === 2 && (
          <div className="text-start">
            <h2 className="fw-black text-slate-900 mb-1">Shift Stats Log</h2>
            <p className="text-muted fs-7 mb-4">Log sheets, environmental contribution index, and driver logs.</p>

            <div className="row g-3">
              {[
                { label: 'Driver Vehicle', value: currentUser?.truck || 'TRUCK-Eco99', desc: 'Active Waste vehicle status: Clean', icon: <FaTruck className="text-warning" size={24} /> },
                { label: 'Shift Status', value: 'On-Duty (Active)', desc: 'Logs initialized: today 06:00 AM', icon: <FaShieldAlt className="text-success" size={24} /> },
                { label: 'CO₂ Savings Factor', value: '0.85 Tons Saved', desc: 'Calculated landfill diversion volume', icon: <FaWrench className="text-info" size={24} /> }
              ].map((stat, idx) => (
                <div className="col-12 col-sm-4" key={idx}>
                  <div className="card glass-card p-4 border-0 shadow-sm text-start h-100">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted fs-8 fw-semibold uppercase tracking-wider">{stat.label}</span>
                      {stat.icon}
                    </div>
                    <h5 className="fw-extrabold text-slate-800 mb-1">{stat.value}</h5>
                    <span className="fs-8 text-muted">{stat.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGNED TASKS (Dispatched) */}
        {activeTab === 3 && (() => {
          const assignedTasks = complaints.filter(c => 
            (c.status === 'Assigned' || c.status === 'Awaiting Authority Verification') && 
            (c.vehicleId === currentUser?.truck || c.assignedTo === currentUser?.email)
          );
          const teamMembers = laborers ? laborers.filter(l => l.vehicleId === currentUser?.truck) : [];

          return (
            <div className="text-start">
              <h2 className="fw-black text-slate-900 mb-1">Dispatched Tasks</h2>
              <p className="text-muted fs-7 mb-4">Urgent or scheduled complaint tasks assigned to your vehicle team.</p>

              <div className="row g-4">
                {assignedTasks.map(task => (
                  <div className="col-12" key={task.id}>
                    <div className="card glass-card p-4 border-0 shadow-sm text-start">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="fw-extrabold text-slate-800 mb-1">Task ID: {task.id}</h6>
                          <span className="badge bg-info-subtle text-info-emphasis px-2 py-1 fs-8 fw-bold">Status: {task.status}</span>
                        </div>
                        <span className="text-muted fs-8">Dispatched: {task.dispatchTime}</span>
                      </div>
                      
                      <div className="row mb-3 fs-7">
                        <div className="col-md-6 mb-2">
                          <strong className="d-block text-slate-800">Location</strong>
                          <span className="text-danger"><FaMapMarkedAlt /> {task.lat.toFixed(5)}, {task.lng.toFixed(5)}</span>
                        </div>
                        <div className="col-md-6 mb-2">
                          <strong className="d-block text-slate-800">Vehicle Assigned</strong>
                          <span className="text-muted">{task.vehicleId || currentUser?.truck}</span>
                        </div>
                        <div className="col-12 mt-2">
                          <strong className="d-block text-slate-800">Description</strong>
                          <span className="text-muted">{task.title} - {task.desc}</span>
                        </div>
                        <div className="col-12 mt-3">
                          <strong className="d-block text-slate-800 mb-1">Team Members Assigned:</strong>
                          <div className="d-flex gap-2 flex-wrap">
                            {teamMembers.map(tm => (
                              <span key={tm.id} className="badge bg-secondary-subtle text-secondary px-2 py-1 fs-8">
                                {tm.name} ({tm.id})
                              </span>
                            ))}
                            {teamMembers.length === 0 && <span className="text-muted italic fs-8">No specific laborers found.</span>}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-top d-flex justify-content-end">
                        {task.status === 'Assigned' ? (
                          <button 
                            className="btn btn-success fw-bold px-4 py-2 eco-btn-primary d-flex align-items-center justify-content-center gap-2"
                            onClick={() => {
                              resolveComplaintTask(task.id, currentUser?.email);
                              toast.success("Task completed. Awaiting Authority Verification.");
                            }}
                          >
                            <FaCheck /> Mark Completed
                          </button>
                        ) : (
                          <span className="text-warning fw-bold d-flex align-items-center gap-1">
                            <FaShieldAlt /> Awaiting Verification
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {assignedTasks.length === 0 && (
                  <div className="col-12 text-center py-5">
                    <FaCheck size={48} className="text-success mb-3 opacity-50" />
                    <h5 className="text-slate-800">No Pending Dispatches</h5>
                    <p className="text-muted">You are all caught up! Keep monitoring the route.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
};

export default WorkerDashboard;
