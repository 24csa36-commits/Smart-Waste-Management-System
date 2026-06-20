import React, { useState, useRef } from 'react';
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
  Button
} from '@mui/material';
import { 
  FaSignOutAlt, 
  FaLeaf, 
  FaMapMarkedAlt, 
  FaExclamationTriangle, 
  FaHistory, 
  FaGift, 
  FaRecycle, 
  FaCoins,
  FaCamera,
  FaCrosshairs,
  FaTrash,
  FaCheck
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { toast, ToastContainer } from 'react-toastify';

// Custom dot marker icon for Leaflet
const getBinMarkerIcon = (fillLevel) => {
  let color = '#06b6d4'; // Cyan default
  if (fillLevel >= 80) color = '#ef4444'; // Red
  else if (fillLevel >= 50) color = '#f59e0b'; // Yellow

  return new L.DivIcon({
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.2);"></div>`,
    className: 'custom-citizen-bin-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

const PublicDashboard = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    bins, 
    complaints, 
    citizenPoints, 
    pointsHistory, 
    rewardsCatalog, 
    logoutUser, 
    addComplaint, 
    earnPoints, 
    redeemReward 
  } = useApp();

  const [activeTab, setActiveTab] = useState(0);
  const [filterType, setFilterType] = useState('All');

  // Report Issue Form State
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [issueType, setIssueType] = useState('General');

  // Camera & Geotag States
  const [photo, setPhoto] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [gpsLocked, setGpsLocked] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState({ lat: null, lng: null });
  const [gpsFetching, setGpsFetching] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Gamified recycle states
  const [recycleCategory, setRecycleCategory] = useState('Plastic');
  const [recycleCount, setRecycleCount] = useState('5');

  // Voucher details state
  const [openVoucherClaimed, setOpenVoucherClaimed] = useState(false);
  const [claimedCode, setClaimedCode] = useState('');
  const [claimedTitle, setClaimedTitle] = useState('');

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const filteredBins = bins.filter(b => filterType === 'All' || b.type === filterType);

  const startCamera = async () => {
    setCameraActive(true);
    setPhoto(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Could not access camera device stream, activating simulated camera capture.", err);
      toast.info("Webcam stream access not found. Simulating high-tech snapshot capture!");
    }
  };

  const captureSnapshot = () => {
    if (streamRef.current && videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPhoto(dataUrl);
      stopCamera();
      toast.success("Snapshot captured successfully!");
    } else {
      // Simulate mock camera photo
      const mockPhotos = [
        "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=640&q=80",
        "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=640&q=80",
        "https://images.unsplash.com/photo-1503596476-1c12a8ba09a9?auto=format&fit=crop&w=640&q=80"
      ];
      const randomPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
      setPhoto(randomPhoto);
      setCameraActive(false);
      toast.success("Simulated snapshot captured successfully!");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const geotagComplaint = () => {
    setGpsFetching(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setGpsCoordinates({ lat, lng });
          setGpsLocked(true);
          setGpsFetching(false);
          toast.success(`Jio geotag locked: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        },
        (error) => {
          console.warn("GPS Geolocator timed out or permission denied, fallback to Coimbatore coords.", error);
          const mockLat = 11.0168 + (Math.random() - 0.5) * 0.03;
          const mockLng = 76.9558 + (Math.random() - 0.5) * 0.03;
          setGpsCoordinates({ lat: mockLat, lng: mockLng });
          setGpsLocked(true);
          setGpsFetching(false);
          toast.info("GPS access denied/not supported. Simulating regional Jio geotag in Coimbatore, Tamil Nadu.");
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      const mockLat = 11.0168 + (Math.random() - 0.5) * 0.03;
      const mockLng = 76.9558 + (Math.random() - 0.5) * 0.03;
      setGpsCoordinates({ lat: mockLat, lng: mockLng });
      setGpsLocked(true);
      setGpsFetching(false);
      toast.info("Jio geotag simulated in Coimbatore, Tamil Nadu.");
    }
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!issueTitle || !issueDesc) {
      toast.error('Please enter a title and description');
      return;
    }

    let lat = 11.0168;
    let lng = 76.9558;

    if (gpsLocked && gpsCoordinates.lat && gpsCoordinates.lng) {
      lat = gpsCoordinates.lat;
      lng = gpsCoordinates.lng;
    }

    addComplaint(issueTitle, issueDesc, lat, lng, issueType, currentUser.email, photo);
    toast.success('Report submitted successfully! Municipal team notified.');
    
    setIssueTitle('');
    setIssueDesc('');
    setIssueType('General');
    setPhoto(null);
    setGpsLocked(false);
    setGpsCoordinates({ lat: null, lng: null });
    stopCamera();
    setActiveTab(0);
  };

  const handleLogRecycling = (e) => {
    e.preventDefault();
    const count = parseInt(recycleCount);
    if (isNaN(count) || count <= 0) {
      toast.error('Please enter a valid count');
      return;
    }
    let pts = 0;
    let actionStr = '';

    if (recycleCategory === 'Plastic') {
      pts = count * 5;
      actionStr = `Recycled ${count} PET Plastic Bottles`;
    } else if (recycleCategory === 'Paper') {
      pts = count * 3;
      actionStr = `Recycled ${count} Paper Cardboard boxes`;
    } else if (recycleCategory === 'Glass') {
      pts = count * 6;
      actionStr = `Disposed ${count} Glass Containers`;
    } else {
      pts = count * 4;
      actionStr = `Deposited ${count} Compostable bags`;
    }

    earnPoints(actionStr, pts);
    toast.success(`Logged! Efficacy points loaded: +${pts} Eco-Credits`);
  };

  const handleClaimReward = (rewardId) => {
    const res = redeemReward(rewardId);
    if (res.success) {
      const reward = rewardsCatalog.find(r => r.id === rewardId);
      setClaimedTitle(reward.title);
      setClaimedCode(res.code);
      setOpenVoucherClaimed(true);
      toast.success('Reward voucher successfully claimed!');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column flex-md-row p-0 bg-light">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Sidebar Nav using Bootstrap list group & custom dark style */}
      <div className="col-12 col-md-3 col-lg-2.5 bg-dark text-white p-4 d-flex flex-column justify-content-between border-end border-secondary" style={{ minWidth: '240px' }}>
        <div>
          <div className="d-flex align-items-center gap-2 mb-5">
            <FaLeaf size={24} className="text-info" />
            <h5 className="fw-black mb-0 text-gradient-citizen text-uppercase">Citizen Hub</h5>
          </div>

          <div className="list-group list-group-flush gap-2">
            {[
              { id: 0, label: 'Dashboard & Points', icon: <FaCoins /> },
              { id: 2, label: 'Report Overflow', icon: <FaExclamationTriangle /> },
              { id: 3, label: 'Gift Catalog', icon: <FaGift /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`list-group-item list-group-item-action bg-transparent text-start border-0 py-3 px-3 rounded-3 d-flex align-items-center gap-3 fs-7 fw-semibold ${activeTab === tab.id ? 'text-info bg-secondary-subtle fw-bold' : 'text-secondary'}`}
                style={{ transition: 'all 0.2s' }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-5 mt-auto">
          <div className="card bg-secondary-subtle border-0 p-3 mb-3 text-start text-white-50">
            <span className="fs-8 d-block mb-1 text-muted">Eco-Citizen</span>
            <strong className="fs-7 text-white text-truncate d-block">{currentUser?.name || 'Jane Doe'}</strong>
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
        
        {/* TAB 0: DASHBOARD & POINTS */}
        {activeTab === 0 && (
          <div className="text-start">
            <h2 className="fw-black text-slate-900 mb-1">Welcome Back, {currentUser?.name || 'Citizen'}!</h2>
            <p className="text-muted fs-7 mb-4">Earn points by logging disposals and redeem them for municipal reward vouchers.</p>

            <div className="row g-4 mb-4">
              {/* Rewards Balance Card */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-lg text-white p-4 h-100 d-flex flex-column justify-content-between" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', borderRadius: '20px' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fs-7 fw-semibold opacity-75">Points Balance</span>
                    <FaCoins size={28} className="opacity-75" />
                  </div>
                  <div>
                    <h1 className="display-3 fw-black mb-1">{citizenPoints}</h1>
                    <span className="fs-8 opacity-75">Redeemable Eco-Credits</span>
                  </div>
                </div>
              </div>

              {/* Log Recycling Card */}
              <div className="col-lg-8">
                <div className="card glass-card p-4 border-0 shadow-sm text-start h-100">
                  <h6 className="fw-extrabold text-slate-800 mb-2 d-flex align-items-center gap-2">
                    <FaRecycle className="text-info" /> Log Disposal & Earn Points
                  </h6>
                  <p className="fs-8 text-muted mb-4">Simulate waste drop-offs at smart bins to record points.</p>

                  <form onSubmit={handleLogRecycling}>
                    <div className="row g-3 align-items-center">
                      <div className="col-12 col-sm-5">
                        <FormControl fullWidth size="small">
                          <InputLabel>Material Type</InputLabel>
                          <Select
                            value={recycleCategory}
                            onChange={(e) => setRecycleCategory(e.target.value)}
                            label="Material Type"
                          >
                            <MenuItem value="Plastic">Plastic Bottles (+5 pts)</MenuItem>
                            <MenuItem value="Paper">Paper Boxes (+3 pts)</MenuItem>
                            <MenuItem value="Glass">Glass Jars (+6 pts)</MenuItem>
                            <MenuItem value="Compost">Organic Compost (+4 pts)</MenuItem>
                          </Select>
                        </FormControl>
                      </div>

                      <div className="col-12 col-sm-4">
                        <TextField 
                          label="Quantity" 
                          type="number"
                          fullWidth 
                          size="small"
                          value={recycleCount}
                          onChange={(e) => setRecycleCount(e.target.value)}
                        />
                      </div>

                      <div className="col-12 col-sm-3">
                        <button 
                          type="submit" 
                          className="btn btn-info w-100 py-2 fw-bold text-white fs-7 citizen-btn-primary"
                        >
                          Log Disposal
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="row g-4">
              {/* History table list */}
              <div className="col-lg-6">
                <div className="card glass-card p-4 border-0 shadow-sm h-100">
                  <h6 className="fw-extrabold text-slate-800 mb-3 d-flex align-items-center gap-2">
                    <FaHistory className="text-info" /> Points Transaction History
                  </h6>

                  <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '280px' }}>
                    {pointsHistory.map((item) => (
                      <div key={item.id} className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white rounded-3 mb-1">
                        <div className="text-start">
                          <strong className="fs-7 text-slate-800 d-block">{item.action}</strong>
                          <span className="fs-8 text-muted">Date: {item.date}</span>
                        </div>
                        <span className={`fw-black fs-6 ${item.points > 0 ? 'text-success' : 'text-danger'}`}>
                          {item.points > 0 ? `+${item.points}` : item.points} Pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Citizen complaints */}
              <div className="col-lg-6">
                <div className="card glass-card p-4 border-0 shadow-sm h-100">
                  <h6 className="fw-extrabold text-slate-800 mb-3 d-flex align-items-center gap-2">
                    <FaExclamationTriangle className="text-danger" /> Filed Overflow Tickets
                  </h6>

                  <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '280px' }}>
                    {complaints.filter(c => c.reporter === currentUser.email).map((c) => (
                      <div key={c.id} className="p-3 border rounded-3 bg-white d-flex justify-content-between align-items-center mb-1">
                        <div className="text-start">
                          <strong className="fs-7 text-slate-800 d-block">{c.title}</strong>
                          <span className="fs-8 text-muted">Filed At: {c.createdAt}</span>
                        </div>
                        <span className={`badge px-2.5 py-1.5 rounded-pill fw-bold fs-8 ${c.status === 'Pending' ? 'bg-warning-subtle text-warning-emphasis' : c.status === 'In Progress' ? 'bg-info-subtle text-info-emphasis' : 'bg-success-subtle text-success'}`}>
                          {c.status}
                        </span>
                      </div>
                    ))}
                    {complaints.filter(c => c.reporter === currentUser.email).length === 0 && (
                      <div className="text-center text-muted py-5 fs-7">No tickets filed yet. Thank you for recycling!</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* TAB 2: REPORT OVERFLOW */}
        {activeTab === 2 && (
          <div className="text-start">
            <h2 className="fw-black text-slate-900 mb-1">Report Overflowing Garbage</h2>
            <p className="text-muted fs-7 mb-4">Notify municipal dispatch teams immediately if a bin requires urgent cleaning.</p>

            <div className="row justify-content-center">
              <div className="col-12 col-md-7">
                <div className="card glass-card p-4 border-0 shadow-sm">
                  <form onSubmit={handleReportSubmit}>
                    <Stack spacing={3}>
                      <TextField 
                        label="Issue Headline" 
                        placeholder="e.g. Overflowing garbage container"
                        fullWidth 
                        required 
                        value={issueTitle} 
                        onChange={(e) => setIssueTitle(e.target.value)}
                      />

                      <FormControl fullWidth>
                        <InputLabel>Waste Type</InputLabel>
                        <Select
                          value={issueType}
                          onChange={(e) => setIssueType(e.target.value)}
                          label="Waste Type"
                        >
                          <MenuItem value="General">General/Landfill</MenuItem>
                          <MenuItem value="Recyclable">Recyclable</MenuItem>
                          <MenuItem value="Organic">Organic</MenuItem>
                          <MenuItem value="Hazardous">Hazardous</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField 
                        label="Describe the issue" 
                        multiline 
                        rows={4}
                        placeholder="Please provide details (e.g. lid is jammed, bottles scattered, location descriptors...)"
                        fullWidth 
                        required 
                        value={issueDesc} 
                        onChange={(e) => setIssueDesc(e.target.value)}
                      />

                      {/* Geotagging Controls */}
                      <div className="card bg-light border-0 p-3 mb-2 rounded-3 text-start">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fs-7 fw-bold text-slate-800 d-flex align-items-center gap-2">
                            <FaCrosshairs className="text-danger" /> Jio-Geotag Tracking
                          </span>
                          <button
                            type="button"
                            onClick={geotagComplaint}
                            disabled={gpsFetching}
                            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 fs-8 px-3 py-1.5"
                            style={{ borderRadius: '6px' }}
                          >
                            {gpsFetching ? "Locating..." : "Get Live GPS Geotag"}
                          </button>
                        </div>
                        {gpsLocked ? (
                          <div className="p-2 bg-success-subtle text-success rounded fs-8 fw-semibold d-flex align-items-center gap-1.5">
                            <FaCheck /> Geotag Locked: {gpsCoordinates.lat.toFixed(5)}, {gpsCoordinates.lng.toFixed(5)} (Chennai Regional Centroid)
                          </div>
                        ) : (
                          <span className="fs-8 text-muted italic">Click button to lock exact GPS coordinates.</span>
                        )}
                      </div>

                      {/* Camera Streaming & Photo Viewport */}
                      <div className="card border p-3 rounded-3 text-center bg-light">
                        <span className="fs-7 fw-bold text-slate-800 d-block mb-2 text-start d-flex align-items-center gap-2">
                          <FaCamera className="text-info" /> Photo Evidence Capture
                        </span>
                        
                        {cameraActive && (
                          <div className="position-relative bg-black rounded-3 overflow-hidden mb-3" style={{ height: '240px' }}>
                            <video 
                              ref={videoRef} 
                              autoPlay 
                              playsInline 
                              muted 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 d-flex gap-2">
                              <button 
                                type="button" 
                                onClick={captureSnapshot} 
                                className="btn btn-info btn-sm text-white px-3 py-1.5 fw-bold"
                              >
                                Capture Photo
                              </button>
                              <button 
                                type="button" 
                                onClick={stopCamera} 
                                className="btn btn-secondary btn-sm px-3 py-1.5"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {photo && !cameraActive && (
                          <div className="position-relative rounded-3 overflow-hidden mb-3" style={{ height: '240px' }}>
                            <img 
                              src={photo} 
                              alt="Evidence preview" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div className="position-absolute top-0 end-0 m-2">
                              <button 
                                type="button" 
                                onClick={() => setPhoto(null)} 
                                className="btn btn-danger btn-sm p-1.5 d-flex align-items-center justify-content-center"
                                style={{ borderRadius: '50%' }}
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </div>
                        )}

                        {!cameraActive && !photo && (
                          <div className="py-4 text-center border rounded-3 border-dashed" style={{ borderStyle: 'dashed' }}>
                            <p className="fs-8 text-muted mb-3">Include snapshot evidence of the overflowing dumpsite for faster dispatch.</p>
                            <button 
                              type="button" 
                              onClick={startCamera} 
                              className="btn btn-outline-info btn-sm d-flex align-items-center gap-2 mx-auto px-4 py-2"
                              style={{ borderRadius: '6px' }}
                            >
                              <FaCamera /> Activate Device Camera
                            </button>
                          </div>
                        )}
                      </div>

                      <button 
                        type="submit" 
                        className="btn btn-danger py-3 fs-6 w-100 fw-bold border-0 shadow-sm"
                        style={{ background: '#f43f5e', borderRadius: '12px' }}
                      >
                        Submit Urgent Report
                      </button>
                    </Stack>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GIFT CATALOG */}
        {activeTab === 3 && (
          <div className="text-start">
            <h2 className="fw-black text-slate-900 mb-1">Redeem Reward Vouchers</h2>
            <p className="text-muted fs-7 mb-4">Trade your disposal points for discount vouchers at local business partners.</p>

            <div className="row g-3">
              {rewardsCatalog.map((reward) => (
                <div className="col-12 col-sm-6 col-md-3" key={reward.id}>
                  <div className="card h-100 glass-card border-0 shadow-sm p-2 d-flex flex-column justify-content-between">
                    <div className="card-body p-3">
                      <span className="badge bg-success-subtle text-success px-2.5 py-1 rounded-pill fs-8 fw-bold mb-3">
                        {reward.category}
                      </span>
                      <h6 className="card-title fw-extrabold text-slate-800 mb-1">{reward.title}</h6>
                      <p className="card-text text-secondary fs-8 lh-base">{reward.desc}</p>
                    </div>

                    <div className="p-3 border-top d-flex justify-content-between align-items-center mt-3 bg-transparent">
                      <strong className="fs-6 text-info">{reward.cost} Pts</strong>
                      <button 
                        onClick={() => handleClaimReward(reward.id)}
                        className="btn btn-info btn-sm text-white px-3 py-1.5 fw-bold"
                        style={{ borderRadius: '6px' }}
                      >
                        Redeem
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Voucher Code Claimed Modal */}
      <Dialog open={openVoucherClaimed} onClose={() => setOpenVoucherClaimed(false)} PaperProps={{ style: { borderRadius: '16px', textAlign: 'center', padding: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 800, color: '#0284c7' }}>Voucher Claimed Successfully!</DialogTitle>
        <DialogContent>
          <p className="text-secondary mb-2 fs-7">Here is your coupon code for <b>{claimedTitle}</b>:</p>
          <h3 className="fw-black py-2 rounded-3 text-center font-monospace tracking-wide text-dark bg-light" style={{ border: '1.5px dashed #cbd5e1' }}>
            {claimedCode}
          </h3>
          <span className="text-muted d-block mt-2 fs-8">Present this code at check-out to redeem your gift.</span>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <button 
            onClick={() => setOpenVoucherClaimed(false)} 
            className="btn btn-info text-white px-4 py-2 fw-bold"
            style={{ borderRadius: '8px' }}
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PublicDashboard;
