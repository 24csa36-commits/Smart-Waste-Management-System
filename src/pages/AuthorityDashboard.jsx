import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Box, 
  Stack, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  LinearProgress, 
  IconButton,
  Chip,
  Checkbox,
  ListItemText,
  OutlinedInput
} from '@mui/material';
import { 
  FaSignOutAlt, 
  FaTruck, 
  FaTrashAlt, 
  FaPlus, 
  FaCheck, 
  FaMapMarkedAlt, 
  FaChartBar, 
  FaExclamationTriangle, 
  FaBuilding,
  FaMapMarkerAlt,
  FaUsers,
  FaGasPump,
  FaCamera
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar,
  Legend
} from 'recharts';
import { toast, ToastContainer } from 'react-toastify';

// Custom dot marker icon for Leaflet
const getMarkerIcon = (fillLevel) => {
  let color = '#10b981'; // Green
  let border = '#047857';
  let pulse = '';
  if (fillLevel >= 80) {
    color = '#ef4444'; // Red
    border = '#b91c1c';
    pulse = 'alert-dot-pulse';
  } else if (fillLevel >= 50) {
    color = '#f59e0b'; // Yellow
    border = '#b45309';
  }

  return new L.DivIcon({
    html: `<div class="${pulse}" style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.25);"></div>`,
    className: 'custom-bin-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const AuthorityDashboard = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    bins, 
    complaints, 
    workers, 
    vehicles,
    logoutUser, 
    addBin, 
    updateComplaintStatus, 
    assignRoute,
    addVehicle,
    updateVehicleStatus,
    addStaff
  } = useApp();

  const [activeTab, setActiveTab] = useState(0);
  const [mapCenter, setMapCenter] = useState([11.0168, 76.9558]);
  
  // Add Bin Modal States
  const [openAddBin, setOpenAddBin] = useState(false);
  const [newBinName, setNewBinName] = useState('');
  const [newBinLat, setNewBinLat] = useState('11.0168');
  const [newBinLng, setNewBinLng] = useState('76.9558');
  const [newBinType, setNewBinType] = useState('General');
  const [newBinCapacity, setNewBinCapacity] = useState('120');

  // Add Staff Modal States
  const [openAddStaff, setOpenAddStaff] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffTruck, setNewStaffTruck] = useState('Unassigned');

  // Photo Evidence Viewer States
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
  const [activeEvidencePhoto, setActiveEvidencePhoto] = useState(null);
  const [activeEvidenceTitle, setActiveEvidenceTitle] = useState('');

  // Add Vehicle Modal States
  const [openAddVehicle, setOpenAddVehicle] = useState(false);
  const [newVehicleId, setNewVehicleId] = useState('');
  const [newVehicleModel, setNewVehicleModel] = useState('');
  const [newVehicleDriver, setNewVehicleDriver] = useState('Unassigned');
  const [newVehicleCapacity, setNewVehicleCapacity] = useState('500');
  const [newVehicleFuel, setNewVehicleFuel] = useState('Electric');

  // Dispatch States
  const [selectedWorker, setSelectedWorker] = useState('');
  const [selectedBinIds, setSelectedBinIds] = useState([]);

  // Calculated Stats
  const urgentBinsCount = bins.filter(b => b.fillLevel >= 80).length;
  const averageFillLevel = Math.round(bins.reduce((acc, b) => acc + b.fillLevel, 0) / bins.length);
  const activeComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleAddBinSubmit = (e) => {
    e.preventDefault();
    if (!newBinName || !newBinLat || !newBinLng || !newBinCapacity) {
      toast.error('Please fill all fields');
      return;
    }
    addBin(newBinName, newBinLat, newBinLng, newBinType, newBinCapacity);
    toast.success(`IoT Bin registered successfully!`);
    setOpenAddBin(false);
    setNewBinName('');
  };

  const handleAddVehicleSubmit = (e) => {
    e.preventDefault();
    if (!newVehicleId || !newVehicleModel || !newVehicleCapacity) {
      toast.error('Please fill all fields');
      return;
    }
    addVehicle(newVehicleId, newVehicleModel, newVehicleDriver, newVehicleCapacity, newVehicleFuel);
    toast.success(`Vehicle ${newVehicleId} registered!`);
    setOpenAddVehicle(false);
    setNewVehicleId('');
    setNewVehicleModel('');
  };

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) {
      toast.error('Please fill all fields');
      return;
    }
    const res = await addStaff(newStaffName, newStaffEmail, newStaffTruck);
    if (res.success) {
      toast.success('Staff member successfully registered!');
      setOpenAddStaff(false);
      setNewStaffName('');
      setNewStaffEmail('');
      setNewStaffTruck('Unassigned');
    } else {
      toast.error(res.message);
    }
  };

  const handleStatusUpdate = (complaintId, nextStatus, workerEmail = null) => {
    updateComplaintStatus(complaintId, nextStatus, workerEmail);
    toast.info(`Report status updated to ${nextStatus}`);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedWorker || selectedBinIds.length === 0) {
      toast.error('Select a driver and at least one bin');
      return;
    }
    assignRoute(selectedWorker, selectedBinIds);
    toast.success('Collection route updated for driver!');
    
    // Also set vehicle of driver to active status
    const driver = workers.find(w => w.email === selectedWorker);
    if (driver && driver.truck) {
      updateVehicleStatus(driver.truck, 'Active', driver.name);
    }

    setSelectedBinIds([]);
  };

  // Recharts Chart Formats based on user specifications:
  // 1. Complaint Trends (tickets filed over time)
  const complaintTrendsData = [
    { day: 'Mon', 'Resolved Tickets': 12, 'Pending Tickets': 8, 'Total Complaints': 20 },
    { day: 'Tue', 'Resolved Tickets': 15, 'Pending Tickets': 14, 'Total Complaints': 29 },
    { day: 'Wed', 'Resolved Tickets': 18, 'Pending Tickets': 9, 'Total Complaints': 27 },
    { day: 'Thu', 'Resolved Tickets': 22, 'Pending Tickets': 11, 'Total Complaints': 33 },
    { day: 'Fri', 'Resolved Tickets': 20, 'Pending Tickets': 15, 'Total Complaints': 35 },
    { day: 'Sat', 'Resolved Tickets': 25, 'Pending Tickets': 5, 'Total Complaints': 30 },
    { day: 'Sun', 'Resolved Tickets': 28, 'Pending Tickets': 4, 'Total Complaints': 32 }
  ];

  // 2. Status Trends (Pending vs In Progress vs Resolved)
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  const statusTrendsData = [
    { name: 'Pending Tickets', value: pendingCount || 1, color: '#ef4444' },
    { name: 'In Progress Dispatch', value: inProgressCount || 1, color: '#06b6d4' },
    { name: 'Resolved Collections', value: resolvedCount || 2, color: '#10b981' }
  ];

  // 3. Vehicle Utilization (load/capacity percentage)
  const vehicleUtilizationData = vehicles.map(v => {
    const pct = v.capacity > 0 ? Math.round((v.load / v.capacity) * 100) : 0;
    return {
      name: v.id,
      'Load (kg)': v.load,
      'Capacity (kg)': v.capacity,
      'Utilization Rate (%)': pct
    };
  });

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column flex-md-row p-0 bg-light text-start">
      <ToastContainer position="top-right" autoClose={2000} />
      
      {/* Sidebar Nav */}
      <div className="col-12 col-md-3 col-lg-2.5 bg-dark text-white p-4 d-flex flex-column justify-content-between border-end border-secondary" style={{ minWidth: '240px' }}>
        <div>
          <div className="d-flex align-items-center gap-2 mb-5">
            <FaBuilding size={24} className="text-success" />
            <h5 className="fw-black mb-0 text-gradient-eco text-uppercase">Municipal Admin</h5>
          </div>

          <div className="list-group list-group-flush gap-2">
            {[
              { id: 0, label: 'Control Center', icon: <FaBuilding /> },
              { id: 1, label: 'Live IoT Map', icon: <FaMapMarkedAlt /> },
              { id: 2, label: 'Complaint Management', icon: <FaExclamationTriangle /> },
              { id: 3, label: 'Assignment Dispatch', icon: <FaTruck /> },
              { id: 4, label: 'Vehicle Management', icon: <FaGasPump /> },
              { id: 5, label: 'Labor Management', icon: <FaUsers /> },
              { id: 6, label: 'Analytics Reports', icon: <FaChartBar /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`list-group-item list-group-item-action bg-transparent text-start border-0 py-3 px-3 rounded-3 d-flex align-items-center gap-3 fs-7 fw-semibold ${activeTab === tab.id ? 'text-success bg-secondary-subtle fw-bold' : 'text-secondary'}`}
                style={{ transition: 'all 0.2s' }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-5 mt-auto">
          <div className="card bg-secondary-subtle border-0 p-3 mb-3 text-start text-white-50">
            <span className="fs-8 d-block mb-1 text-muted">Admin Manager</span>
            <strong className="fs-7 text-white text-truncate d-block">{currentUser?.name || 'Administrator'}</strong>
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
        
        {/* TAB 0: CONTROL CENTER */}
        {activeTab === 0 && (
          <div>
            <h2 className="fw-black text-slate-900 mb-1">Control Center</h2>
            <p className="text-muted fs-7 mb-4">Live simulation metrics monitor for municipal waste utilities.</p>

            <div className="row g-3 mb-4">
              {[
                { label: 'Registered IoT Bins', value: bins.length, color: 'text-dark' },
                { label: 'Avg Fill Rate', value: `${averageFillLevel}%`, color: averageFillLevel > 65 ? 'text-warning' : 'text-success' },
                { label: 'Active Trucks Logged', value: vehicles.length, color: 'text-info' },
                { label: 'Pending Public Tickets', value: activeComplaintsCount, color: activeComplaintsCount > 0 ? 'text-danger' : 'text-success' }
              ].map((card, idx) => (
                <div className="col-6 col-md-3" key={idx}>
                  <div className="card glass-card p-4 border-0 shadow-sm text-start h-100">
                    <span className="text-muted fs-8 fw-semibold uppercase tracking-wider">{card.label}</span>
                    <h3 className={`fw-black mt-2 mb-0 ${card.color}`}>{card.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-4">
              {/* Smart fill alerts */}
              <div className="col-lg-6">
                <div className="card glass-card p-4 border-0 shadow-sm h-100 text-start">
                  <h6 className="fw-extrabold text-slate-800 mb-3 d-flex align-items-center gap-2">
                    <FaExclamationTriangle className="text-danger" /> Smart Fill-Level Alerts
                  </h6>
                  
                  <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '280px' }}>
                    {bins.filter(b => b.fillLevel >= 50).sort((a,b) => b.fillLevel - a.fillLevel).map(bin => (
                      <div key={bin.id} className="p-3 border rounded-3 d-flex justify-content-between align-items-center bg-white" style={{ borderLeft: bin.fillLevel >= 80 ? '4px solid #ef4444 !important' : '4px solid #f59e0b !important' }}>
                        <div>
                          <strong className="fs-7 text-slate-800 d-block">{bin.name}</strong>
                          <span className="fs-8 text-muted">ID: {bin.id} | Type: {bin.type}</span>
                        </div>
                        <span className={`badge px-2.5 py-1.5 rounded-pill fw-bold fs-8 ${bin.fillLevel >= 80 ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning-emphasis'}`}>
                          {bin.fillLevel}%
                        </span>
                      </div>
                    ))}
                    {bins.filter(b => b.fillLevel >= 50).length === 0 && (
                      <div className="text-center text-muted py-5 fs-7">No container alerts. All bins are clean.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Connected trucks */}
              <div className="col-lg-6">
                <div className="card glass-card p-4 border-0 shadow-sm h-100 text-start">
                  <h6 className="fw-extrabold text-slate-800 mb-3 d-flex align-items-center gap-2">
                    <FaTruck className="text-success" /> Active Fleet Utilization
                  </h6>

                  <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '280px' }}>
                    {vehicles.map(v => {
                      const util = Math.round((v.load / v.capacity) * 100);
                      return (
                        <div key={v.id} className="p-3 border rounded-3 bg-white">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <div>
                              <strong className="fs-7 text-slate-800 d-block">{v.id} ({v.model})</strong>
                              <span className="fs-8 text-muted">Driver: {v.driver} | Fuel: {v.fuel}</span>
                            </div>
                            <span className="badge bg-secondary-subtle text-secondary px-2.5 py-1.5 rounded-pill fw-bold fs-8">{v.status}</span>
                          </div>
                          <div className="progress mt-2" style={{ height: '6px' }}>
                            <div 
                              className="progress-bar bg-success"
                              role="progressbar" 
                              style={{ width: `${util}%` }}
                            />
                          </div>
                          <span className="fs-8 text-muted d-block mt-1">Cargo Load: {v.load}kg / {v.capacity}kg ({util}% utilization)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: LIVE IoT MAP */}
        {activeTab === 1 && (
          <div className="d-flex flex-column flex-grow-1" style={{ height: 'calc(100vh - 80px)' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="fw-black text-slate-900 mb-1">Live IoT Map</h2>
                <p className="text-muted fs-7 mb-0">Locations and live fill rates of Indian Smart Trash Bins.</p>
              </div>
              <button 
                onClick={() => setOpenAddBin(true)}
                className="btn btn-success eco-btn-primary d-flex align-items-center gap-2 py-2"
              >
                <FaPlus /> Register new smart Bin
              </button>
            </div>

            <div className="flex-grow-1 position-relative rounded-4 border overflow-hidden shadow-sm" style={{ minHeight: '380px' }}>
              <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
                <ChangeMapView center={mapCenter} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {bins.map(bin => (
                  <Marker 
                    key={bin.id} 
                    position={[bin.lat, bin.lng]} 
                    icon={getMarkerIcon(bin.fillLevel)}
                  >
                    <Popup>
                      <div className="p-1 text-start" style={{ minWidth: '160px' }}>
                        <h6 className="fw-bold mb-1 fs-7">{bin.name}</h6>
                        <span className="d-block fs-8 text-muted mb-2">ID: <b>{bin.id}</b> | Type: {bin.type}</span>
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span className="fs-8 text-secondary">Fill Level</span>
                          <strong className={`fs-8 ${bin.fillLevel >= 80 ? 'text-danger' : bin.fillLevel >= 50 ? 'text-warning' : 'text-success'}`}>{bin.fillLevel}%</strong>
                        </div>
                        <div className="progress mb-2" style={{ height: '5px' }}>
                          <div 
                            className={`progress-bar ${bin.fillLevel >= 80 ? 'bg-danger' : bin.fillLevel >= 50 ? 'bg-warning' : 'bg-success'}`}
                            role="progressbar" 
                            style={{ width: `${bin.fillLevel}%` }}
                          />
                        </div>
                        <span className="fs-8 text-muted d-block mt-2">Cap: {bin.capacity}L | Emptied: {bin.lastEmptied}</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}

        {/* TAB 2: COMPLAINT MANAGEMENT */}
        {activeTab === 2 && (
          <div>
            <h2 className="fw-black text-slate-900 mb-1">Complaint Management</h2>
            <p className="text-muted fs-7 mb-4">Log, review, and dispatch teams to resolve citizen overflowing dump issues.</p>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr className="fs-8 text-secondary uppercase fw-extrabold">
                      <th className="py-3 px-4">Ticket ID</th>
                      <th className="py-3">Details / Location</th>
                      <th className="py-3">Category</th>
                      <th className="py-3">Complaint Raiser</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Filed At</th>
                      <th className="py-3 text-center">Dispatch Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((c) => (
                      <tr key={c.id} className="fs-7">
                        <td className="py-3 px-4 fw-bold text-slate-800">{c.id}</td>
                        <td className="py-3 text-start">
                          <strong className="fs-7 text-slate-800 d-block">{c.title}</strong>
                          <span className="fs-8 text-muted d-block">{c.desc}</span>
                          <span className="fs-8 text-danger fw-semibold d-block mt-1">📍 Jio Geotag: {c.lat.toFixed(5)}, {c.lng.toFixed(5)}</span>
                          {c.photo && (
                            <button 
                              onClick={() => {
                                setActiveEvidencePhoto(c.photo);
                                setActiveEvidenceTitle(c.title);
                                setOpenPhotoDialog(true);
                              }}
                              className="btn btn-sm btn-outline-info d-inline-flex align-items-center gap-1 py-1 px-2 mt-1.5 fs-8 fw-bold border shadow-xs"
                              style={{ borderRadius: '6px' }}
                            >
                              <FaCamera size={11} /> View Photo Evidence
                            </button>
                          )}
                        </td>
                        <td className="py-3">
                          <span className="badge bg-light border text-secondary px-2.5 py-1.5 fs-8 fw-semibold">{c.type}</span>
                        </td>
                        <td className="py-3 text-muted">{c.reporter}</td>
                        <td className="py-3">
                          <span className={`badge px-2.5 py-1.5 rounded-pill fw-bold fs-8 ${c.status === 'Pending' ? 'bg-warning-subtle text-warning-emphasis' : c.status === 'In Progress' ? 'bg-info-subtle text-info-emphasis' : 'bg-success-subtle text-success'}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 text-muted">{c.createdAt}</td>
                        <td className="py-3 text-center">
                          <div className="d-flex justify-content-center gap-1">
                            {c.status === 'Pending' && (
                              <button 
                                onClick={() => handleStatusUpdate(c.id, 'In Progress', 'worker@eco.com')}
                                className="btn btn-outline-info py-1.5 px-3 fs-8 fw-bold"
                                style={{ borderRadius: '6px' }}
                              >
                                Dispatch Driver
                              </button>
                            )}
                            {c.status === 'In Progress' && (
                              <button 
                                onClick={() => handleStatusUpdate(c.id, 'Resolved')}
                                className="btn btn-success py-1.5 px-3 fs-8 fw-bold"
                                style={{ borderRadius: '6px' }}
                              >
                                Resolve
                              </button>
                            )}
                            {c.status === 'Resolved' && (
                              <span className="text-success p-1.5"><FaCheck /> Resolved</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGNMENT DISPATCH */}
        {activeTab === 3 && (
          <div>
            <h2 className="fw-black text-slate-900 mb-1">Assignment Dispatch</h2>
            <p className="text-muted fs-7 mb-4">Organize collection routes and assign driver check-lists.</p>

            <div className="row g-4">
              <div className="col-lg-5">
                <div className="card glass-card p-4 border-0 shadow-sm">
                  <h5 className="fw-extrabold text-slate-800 mb-4">Create Route Assignment</h5>
                  
                  <form onSubmit={handleAssignSubmit}>
                    <Stack spacing={3}>
                      <FormControl fullWidth>
                        <InputLabel>Select Driver</InputLabel>
                        <Select
                          value={selectedWorker}
                          onChange={(e) => setSelectedWorker(e.target.value)}
                          label="Select Driver"
                          required
                        >
                          {workers.map(w => (
                            <MenuItem key={w.email} value={w.email}>{w.name} ({w.truck})</MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth>
                        <InputLabel>Assign Bins</InputLabel>
                        <Select
                          multiple
                          value={selectedBinIds}
                          onChange={(e) => setSelectedBinIds(e.target.value)}
                          input={<OutlinedInput label="Assign Bins" />}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((value) => (
                                <Chip key={value} label={value} size="small" />
                              ))}
                            </Box>
                          )}
                        >
                          {bins.map((bin) => (
                            <MenuItem key={bin.id} value={bin.id}>
                              <Checkbox checked={selectedBinIds.indexOf(bin.id) > -1} />
                              <ListItemText primary={`${bin.id} - ${bin.name} (${bin.fillLevel}%)`} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <button 
                        type="submit" 
                        className="btn btn-success w-100 py-3 fs-6 eco-btn-primary"
                      >
                        Dispatch Route
                      </button>
                    </Stack>
                  </form>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="card glass-card p-4 border-0 shadow-sm">
                  <h5 className="fw-extrabold text-slate-800 mb-4">Active Assignments Log</h5>
                  
                  <div className="d-flex flex-column gap-4">
                    {workers.map(worker => (
                      <div key={worker.email} className="pb-3 border-bottom last-border-0">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong className="fs-6 text-slate-800">{worker.name}</strong>
                            <span className="d-block fs-8 text-muted">Vehicle Assigned: {worker.truck}</span>
                          </div>
                          <span className="badge bg-light text-secondary border px-2.5 py-1.5 rounded-pill fs-8">{worker.status}</span>
                        </div>

                        <div className="mt-3">
                          <span className="fs-8 text-muted d-block mb-2">Bins to Collect:</span>
                          <div className="d-flex flex-wrap gap-2">
                            {worker.route.map(binId => {
                              const b = bins.find(item => item.id === binId);
                              return (
                                <span 
                                  key={binId} 
                                  className={`badge px-2.5 py-1.5 rounded-pill fs-8 ${b && b.fillLevel >= 80 ? 'bg-danger-subtle text-danger border border-danger-subtle' : 'bg-light text-secondary border'}`}
                                >
                                  {binId} ({b ? b.fillLevel : 0}%)
                                </span>
                              );
                            })}
                            {worker.route.length === 0 && (
                              <span className="fs-8 text-muted italic">Route Empty. Driver is on standby.</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VEHICLE MANAGEMENT */}
        {activeTab === 4 && (
          <div>
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
              <div>
                <h2 className="fw-black text-slate-900 mb-1">Vehicle Management</h2>
                <p className="text-muted fs-7 mb-0">Monitor truck loads, capacity metrics, and fuel allocations.</p>
              </div>
              <button 
                onClick={() => setOpenAddVehicle(true)}
                className="btn btn-success eco-btn-primary d-flex align-items-center gap-2 py-2 fs-7"
              >
                <FaPlus /> Register New Vehicle
              </button>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr className="fs-8 text-secondary uppercase fw-extrabold">
                      <th className="py-3 px-4">Vehicle ID</th>
                      <th className="py-3">Model</th>
                      <th className="py-3">Assigned Crew Driver</th>
                      <th className="py-3">Fuel Type</th>
                      <th className="py-3">Load status</th>
                      <th className="py-3">Load Utilization Rate</th>
                      <th className="py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((v) => {
                      const util = v.capacity > 0 ? Math.round((v.load / v.capacity) * 100) : 0;
                      return (
                        <tr key={v.id} className="fs-7">
                          <td className="py-3 px-4 fw-bold text-slate-800">{v.id}</td>
                          <td className="py-3">{v.model}</td>
                          <td className="py-3 fw-bold">{v.driver}</td>
                          <td className="py-3">
                            <span className="badge bg-light border text-dark fs-8 px-2 py-1"><FaGasPump className="me-1" /> {v.fuel}</span>
                          </td>
                          <td className="py-3 text-muted">{v.load}kg / {v.capacity}kg</td>
                          <td className="py-3" style={{ width: '20%' }}>
                            <div className="d-flex align-items-center gap-3">
                              <div className="progress flex-grow-1" style={{ height: '6px' }}>
                                <div 
                                  className="progress-bar bg-success"
                                  role="progressbar" 
                                  style={{ width: `${util}%` }}
                                />
                              </div>
                              <strong>{util}%</strong>
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            <span className={`badge px-2.5 py-1.5 rounded-pill fs-8 ${v.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning-emphasis'}`}>
                              {v.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LABOR MANAGEMENT */}
        {activeTab === 5 && (
          <div>
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
              <div>
                <h2 className="fw-black text-slate-900 mb-1">Labor Management</h2>
                <p className="text-muted fs-7 mb-0">Manage driver check-in status, shift records, and performance ratings.</p>
              </div>
              <button 
                onClick={() => setOpenAddStaff(true)}
                className="btn btn-success eco-btn-primary d-flex align-items-center gap-2 py-2 fs-7"
              >
                <FaPlus /> Register New Staff
              </button>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr className="fs-8 text-secondary uppercase fw-extrabold">
                      <th className="py-3 px-4">Staff Name</th>
                      <th className="py-3">Contact Email</th>
                      <th className="py-3">Assigned Truck</th>
                      <th className="py-3">Active Route Bins</th>
                      <th className="py-3">Performance Index</th>
                      <th className="py-3 text-center">Duty Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map((w, idx) => (
                      <tr key={w.email} className="fs-7">
                        <td className="py-3 px-4 fw-bold text-slate-800">{w.name}</td>
                        <td className="py-3 text-muted">{w.email}</td>
                        <td className="py-3 font-monospace fw-bold">{w.truck || 'Unassigned'}</td>
                        <td className="py-3">
                          {w.route.length > 0 ? (
                            <span className="badge bg-info-subtle text-info-emphasis px-2 py-1.5">{w.route.join(', ')}</span>
                          ) : (
                            <span className="text-muted italic fs-8">Standby</span>
                          )}
                        </td>
                        <td className="py-3">
                          <strong className="text-success">A+ (98%)</strong>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`badge px-2.5 py-1.5 rounded-pill fs-8 ${w.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-light text-dark'}`}>
                            {w.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ANALYTICS REPORTS */}
        {activeTab === 6 && (
          <div>
            <h2 className="fw-black text-slate-900 mb-1">Analytics & reports</h2>
            <p className="text-muted fs-7 mb-4">Detailed analytical trends mapping ticket complaints, statuses, and truck fleet utilization rates.</p>

            <div className="row g-4 mb-4">
              {/* Chart 1: Complaint Trends */}
              <div className="col-lg-8">
                <div className="card glass-card p-4 border-0 shadow-sm">
                  <h6 className="fw-extrabold text-slate-800 mb-4">Complaint Trends (Weekly Tickets)</h6>
                  <div style={{ height: 260, width: '100%', minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <AreaChart data={complaintTrendsData}>
                        <defs>
                          <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="Total Complaints" stroke="#ef4444" fillOpacity={1} fill="url(#colorComplaints)" />
                        <Area type="monotone" dataKey="Resolved Tickets" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Chart 2: Status Trends */}
              <div className="col-lg-4">
                <div className="card glass-card p-4 border-0 shadow-sm h-100 d-flex flex-column justify-content-between">
                  <h6 className="fw-extrabold text-slate-800 mb-4">Status Trends</h6>
                  
                  <div className="my-auto" style={{ height: 180, width: '100%', minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <PieChart>
                        <Pie
                          data={statusTrendsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {statusTrendsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="d-flex flex-column gap-2 mt-3">
                    {statusTrendsData.map(item => (
                      <div key={item.name} className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2 fs-8 fw-semibold text-secondary">
                          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color }} />
                          {item.name}
                        </div>
                        <strong className="fs-8 text-slate-900">{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 3: Vehicle Utilization */}
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="card glass-card p-4 border-0 shadow-sm">
                  <h6 className="fw-extrabold text-slate-800 mb-4">Vehicle Utilization Rate (%)</h6>
                  <div style={{ height: 260, width: '100%', minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <BarChart data={vehicleUtilizationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Utilization Rate (%)" name="Load Efficiency %" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Dialog Modal: Add IoT Bin */}
      <Dialog open={openAddBin} onClose={() => setOpenAddBin(false)} PaperProps={{ style: { borderRadius: '16px', padding: '12px' } }}>
        <form onSubmit={handleAddBinSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>Register New Smart IoT Bin</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField 
                label="Location Name" 
                fullWidth 
                required 
                value={newBinName} 
                onChange={(e) => setNewBinName(e.target.value)} 
                placeholder="e.g. Valencia Street Market"
              />
              <div className="row g-3">
                <div className="col-6">
                  <TextField 
                    label="Latitude" 
                    fullWidth 
                    required 
                    type="number"
                    inputProps={{ step: "any" }}
                    value={newBinLat} 
                    onChange={(e) => setNewBinLat(e.target.value)} 
                  />
                </div>
                <div className="col-6">
                  <TextField 
                    label="Longitude" 
                    fullWidth 
                    required 
                    type="number"
                    inputProps={{ step: "any" }}
                    value={newBinLng} 
                    onChange={(e) => setNewBinLng(e.target.value)} 
                  />
                </div>
              </div>
              <div className="row g-3">
                <div className="col-6">
                  <FormControl fullWidth>
                    <InputLabel>Waste Type</InputLabel>
                    <Select
                      value={newBinType}
                      onChange={(e) => setNewBinType(e.target.value)}
                      label="Waste Type"
                    >
                      <MenuItem value="General">General</MenuItem>
                      <MenuItem value="Recyclable">Recyclable</MenuItem>
                      <MenuItem value="Organic">Organic</MenuItem>
                      <MenuItem value="Hazardous">Hazardous</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-6">
                  <TextField 
                    label="Capacity (Liters)" 
                    fullWidth 
                    required 
                    type="number"
                    value={newBinCapacity} 
                    onChange={(e) => setNewBinCapacity(e.target.value)} 
                  />
                </div>
              </div>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <button 
              type="button" 
              onClick={() => setOpenAddBin(false)} 
              className="btn btn-link text-muted text-decoration-none fw-bold me-2 fs-7"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-success eco-btn-primary px-4"
            >
              Register Bin
            </button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog Modal: Add Vehicle */}
      <Dialog open={openAddVehicle} onClose={() => setOpenAddVehicle(false)} PaperProps={{ style: { borderRadius: '16px', padding: '12px' } }}>
        <form onSubmit={handleAddVehicleSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>Register New Fleet Vehicle</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField 
                label="Vehicle / Plate ID" 
                fullWidth 
                required 
                value={newVehicleId} 
                onChange={(e) => setNewVehicleId(e.target.value)} 
                placeholder="e.g. TRUCK-TN01X"
              />
              <TextField 
                label="Model / Make" 
                fullWidth 
                required 
                value={newVehicleModel} 
                onChange={(e) => setNewVehicleModel(e.target.value)} 
                placeholder="e.g. CNG Pack-Compactor 5T"
              />
              <div className="row g-3">
                <div className="col-6">
                  <FormControl fullWidth>
                    <InputLabel>Fuel Allocation</InputLabel>
                    <Select
                      value={newVehicleFuel}
                      onChange={(e) => setNewVehicleFuel(e.target.value)}
                      label="Fuel Allocation"
                    >
                      <MenuItem value="Electric">Electric</MenuItem>
                      <MenuItem value="CNG">CNG</MenuItem>
                      <MenuItem value="Diesel">Diesel</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-6">
                  <TextField 
                    label="Cargo Capacity (kg)" 
                    fullWidth 
                    required 
                    type="number"
                    value={newVehicleCapacity} 
                    onChange={(e) => setNewVehicleCapacity(e.target.value)} 
                  />
                </div>
              </div>
              <FormControl fullWidth>
                <InputLabel>Assign Driver</InputLabel>
                <Select
                  value={newVehicleDriver}
                  onChange={(e) => setNewVehicleDriver(e.target.value)}
                  label="Assign Driver"
                >
                  <MenuItem value="Unassigned">Leave Unassigned</MenuItem>
                  {workers.map(w => (
                    <MenuItem key={w.email} value={w.name}>{w.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <button 
              type="button" 
              onClick={() => setOpenAddVehicle(false)} 
              className="btn btn-link text-muted text-decoration-none fw-bold me-2 fs-7"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-success eco-btn-primary px-4"
            >
              Register Vehicle
            </button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog Modal: Add Staff */}
      <Dialog open={openAddStaff} onClose={() => setOpenAddStaff(false)} PaperProps={{ style: { borderRadius: '16px', padding: '12px' } }}>
        <form onSubmit={handleAddStaffSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>Register New Staff Member</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField 
                label="Full Name" 
                fullWidth 
                required 
                value={newStaffName} 
                onChange={(e) => setNewStaffName(e.target.value)} 
                placeholder="e.g. Ramesh Kumar"
              />
              <TextField 
                label="Contact Email" 
                fullWidth 
                required 
                type="email"
                value={newStaffEmail} 
                onChange={(e) => setNewStaffEmail(e.target.value)} 
                placeholder="e.g. ramesh@eco.com"
              />
              <FormControl fullWidth>
                <InputLabel>Assign Fleet Truck</InputLabel>
                <Select
                  value={newStaffTruck}
                  onChange={(e) => setNewStaffTruck(e.target.value)}
                  label="Assign Fleet Truck"
                >
                  <MenuItem value="Unassigned">Leave Unassigned</MenuItem>
                  {vehicles.filter(v => v.driver === 'Unassigned' || v.driver === '' || !v.driver).map(v => (
                    <MenuItem key={v.id} value={v.id}>{v.id} ({v.model})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <button 
              type="button" 
              onClick={() => setOpenAddStaff(false)} 
              className="btn btn-link text-muted text-decoration-none fw-bold me-2 fs-7"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-success eco-btn-primary px-4"
            >
              Register Staff
            </button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog Modal: Photo Evidence Viewer */}
      <Dialog 
        open={openPhotoDialog} 
        onClose={() => setOpenPhotoDialog(false)} 
        PaperProps={{ style: { borderRadius: '16px', padding: '12px', maxWidth: '600px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Geotagged Evidence Photo</DialogTitle>
        <DialogContent>
          <p className="text-secondary fs-7 mb-3">Geotagged snapshot evidence for ticket: <b>{activeEvidenceTitle}</b></p>
          {activeEvidencePhoto ? (
            <div className="rounded-3 overflow-hidden border shadow-sm" style={{ width: '100%', maxHeight: '400px' }}>
              <img 
                src={activeEvidencePhoto} 
                alt="Complaint evidence" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          ) : (
            <div className="py-5 text-center text-muted italic">No evidence photo available.</div>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <button 
            type="button" 
            onClick={() => setOpenPhotoDialog(false)} 
            className="btn btn-secondary px-4"
            style={{ borderRadius: '8px' }}
          >
            Close
          </button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default AuthorityDashboard;
