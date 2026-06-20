import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FaTruck, FaUsers, FaCheckCircle, FaArrowLeft, FaMapMarkerAlt, FaCamera } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

const AssignmentDispatch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicles, laborers, dispatchAssignment } = useApp();

  const complaint = location.state?.complaint;

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  if (!complaint) {
    return (
      <div className="container p-5 text-center mt-5">
        <h2>No Complaint Selected!</h2>
        <p className="text-muted">Please select a complaint from the dashboard.</p>
        <button className="btn btn-secondary mt-3" onClick={() => navigate('/dashboard/authority')}>Go Back to Dashboard</button>
      </div>
    );
  }

  // Filter for available vehicles and add a mock distance to simulate "near the area"
  const availableVehicles = vehicles.map(v => ({
    ...v,
    distance: (Math.random() * 4.5 + 0.5).toFixed(1)
  })).sort((a, b) => a.distance - b.distance);

  // Get laborers for the selected vehicle
  const vehicleLaborers = selectedVehicle 
    ? laborers.filter(l => l.vehicleId === selectedVehicle.id) 
    : [];

  const handleDispatch = () => {
    if (!selectedVehicle) {
      toast.error('Please select a vehicle first.');
      return;
    }

    // Save exactly as requested
    dispatchAssignment(
      complaint.id, 
      selectedVehicle.id, 
      selectedVehicle.id, // using ID as vehicleNumber
      selectedVehicle.driver, 
      vehicleLaborers
    );

    toast.success(`Assignment Dispatched to Vehicle ${selectedVehicle.id}`);
    
    setTimeout(() => {
      navigate('/dashboard/authority');
    }, 1500);
  };

  return (
    <div className="container-fluid min-vh-100 bg-light py-4 px-3 px-md-5">
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-outline-secondary me-3" onClick={() => navigate('/dashboard/authority')}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h2 className="fw-black text-slate-900 mb-0">Dispatch Assignment</h2>
      </div>

      <div className="row g-4">
        {/* Complaint Details */}
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3 border-bottom pb-2">Complaint Details</h5>
            <div className="row">
              <div className="col-md-3 mb-2">
                <span className="text-muted fs-7 d-block">Ticket ID</span>
                <strong className="fs-6">{complaint.id}</strong>
              </div>
              <div className="col-md-3 mb-2">
                <span className="text-muted fs-7 d-block">Category</span>
                <span className="badge bg-secondary-subtle text-dark px-2 py-1">{complaint.type}</span>
              </div>
              <div className="col-md-6 mb-2">
                <span className="text-muted fs-7 d-block">Location</span>
                <strong className="fs-6 text-danger"><FaMapMarkerAlt /> {complaint.lat.toFixed(5)}, {complaint.lng.toFixed(5)}</strong>
              </div>
              <div className="col-md-8 mt-2">
                <span className="text-muted fs-7 d-block">Description</span>
                <p className="mb-0 fw-semibold">{complaint.title} - <span className="fw-normal">{complaint.desc}</span></p>
              </div>
              {complaint.photo && (
                <div className="col-md-4 mt-2">
                  <span className="text-muted fs-7 d-block">Evidence Image</span>
                  <div className="bg-light border rounded d-flex align-items-center justify-content-center" style={{ height: '80px' }}>
                    <span className="text-muted fs-8"><FaCamera /> Photo Available</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vehicles Selection */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
              <FaTruck className="text-primary" /> Available Vehicles Near Location
            </h5>
            
            <div className="d-flex flex-column gap-3 overflow-auto pe-2" style={{ maxHeight: '400px' }}>
              {availableVehicles.map(v => (
                <div 
                  key={v.id} 
                  className={`p-3 border rounded-3 cursor-pointer transition-all ${selectedVehicle?.id === v.id ? 'border-primary bg-primary-subtle shadow-sm' : 'bg-white hover-bg-light'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedVehicle(v)}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <strong className="d-block fs-6">{v.id}</strong>
                      <span className="text-muted fs-8">{v.model}</span>
                    </div>
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                      {v.distance} km away
                    </span>
                  </div>
                  <div className="d-flex justify-content-between fs-8">
                    <span><strong className="text-dark">Driver:</strong> {v.driver}</span>
                    <span><strong className="text-dark">Status:</strong> {v.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Laborers List & Action */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 d-flex flex-column">
            <h5 className="fw-bold mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
              <FaUsers className="text-info" /> Associated Labor Team
            </h5>
            
            <div className="flex-grow-1 overflow-auto pe-2" style={{ maxHeight: '300px' }}>
              {!selectedVehicle ? (
                <div className="text-center text-muted py-5 mt-4">
                  <FaTruck size={48} className="mb-3 opacity-25" />
                  <p>Select a vehicle to view the assigned laborers.</p>
                </div>
              ) : (
                <>
                  <div className="mb-3 p-3 bg-light rounded border">
                    <h6 className="fw-bold text-slate-800 mb-1">Vehicle Details</h6>
                    <p className="mb-1 fs-7"><strong>Vehicle:</strong> {selectedVehicle.id} ({selectedVehicle.model})</p>
                    <p className="mb-0 fs-7"><strong>Driver:</strong> {selectedVehicle.driver}</p>
                  </div>
                  
                  {vehicleLaborers.length === 0 ? (
                    <div className="text-center text-muted py-3">
                      <p>No laborers assigned to this vehicle.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="table-light fs-8 text-secondary uppercase">
                          <tr>
                            <th>Labor ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody className="fs-7">
                          {vehicleLaborers.map(l => (
                            <tr key={l.id}>
                              <td className="fw-bold text-slate-800">{l.id}</td>
                              <td>{l.name}</td>
                              <td className="text-muted">{l.phone}</td>
                              <td>
                                <span className={`badge ${l.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                                  {l.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Dispatch Action */}
            <div className="mt-4 pt-3 border-top">
              <button 
                onClick={handleDispatch}
                disabled={!selectedVehicle}
                className={`btn w-100 py-3 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2 ${selectedVehicle ? 'btn-success eco-btn-primary' : 'btn-secondary opacity-50'}`}
                style={{ borderRadius: '10px' }}
              >
                <FaCheckCircle /> {selectedVehicle ? `Dispatch Assignment` : 'Select a Vehicle'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AssignmentDispatch;
