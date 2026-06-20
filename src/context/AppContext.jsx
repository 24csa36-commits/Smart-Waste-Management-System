import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

const BACKEND_URL = 'http://localhost:3001';

// Seed coordinates positioned in India, Tamil Nadu (Coimbatore)
const INITIAL_BINS = [
  { id: 'BIN-01', name: 'Gandhipuram Cross Cut Road, Coimbatore', lat: 11.0183, lng: 76.9691, fillLevel: 82, type: 'General', capacity: 150, lastEmptied: '2026-06-19 14:30' },
  { id: 'BIN-02', name: 'RS Puram DB Road, Coimbatore', lat: 11.0125, lng: 76.9456, fillLevel: 45, type: 'Recyclable', capacity: 100, lastEmptied: '2026-06-18 09:15' },
  { id: 'BIN-03', name: 'Peelamedu Avinashi Road, Coimbatore', lat: 11.0267, lng: 77.0118, fillLevel: 92, type: 'Organic', capacity: 120, lastEmptied: '2026-06-20 06:00' },
  { id: 'BIN-04', name: 'Town Hall Main Area, Coimbatore', lat: 10.9964, lng: 76.9619, fillLevel: 15, type: 'Recyclable', capacity: 100, lastEmptied: '2026-06-19 11:20' },
  { id: 'BIN-05', name: 'Race Course Walking Path, Coimbatore', lat: 10.9998, lng: 76.9749, fillLevel: 68, type: 'Hazardous', capacity: 80, lastEmptied: '2026-06-19 17:45' },
  { id: 'BIN-06', name: 'Ukkadam Bus Stand, Coimbatore', lat: 10.9878, lng: 76.9632, fillLevel: 30, type: 'General', capacity: 120, lastEmptied: '2026-06-20 02:10' }
];

const INITIAL_COMPLAINTS = [
  { id: 'COMP-101', title: 'Overflowing plastic bin at RS Puram', desc: 'The recycling bin is full and plastics are scattering around.', lat: 11.0125, lng: 76.9456, type: 'Recyclable', status: 'Pending', reporter: 'citizen@eco.com', binId: 'BIN-02', createdAt: '2026-06-20 05:40' },
  { id: 'COMP-102', title: 'Hazardous paint disposal near Peelamedu', desc: 'Multiple old paint cans left adjacent to the park entrance.', lat: 11.0267, lng: 77.0118, type: 'Hazardous', status: 'In Progress', reporter: 'alex@citizen.org', assignedTo: 'worker@eco.com', createdAt: '2026-06-19 16:30' }
];

const INITIAL_WORKERS = [
  { email: 'worker@eco.com', name: 'John Doe', truck: 'TRUCK-Eco99', status: 'Active', route: ['BIN-03', 'BIN-01'] },
  { email: 'driver2@eco.com', name: 'Sarah Connor', truck: 'TRUCK-Green77', status: 'Active', route: ['BIN-05'] }
];

const INITIAL_VEHICLES = [
  { id: 'TRUCK-Eco99', model: 'E-Garbage Lifter XL', driver: 'John Doe', capacity: 500, load: 380, fuel: 'Electric', status: 'Active' },
  { id: 'TRUCK-Green77', model: 'CNG Pack-Compactor', driver: 'Sarah Connor', capacity: 600, load: 180, fuel: 'CNG', status: 'Active' },
  { id: 'TRUCK-Power44', model: 'Diesel Heavy Hauler', driver: 'Unassigned', capacity: 800, load: 0, fuel: 'Diesel', status: 'Idle' }
];

const REWARDS_CATALOG = [
  { id: 'R-01', title: 'Starbucks Hot Coffee', cost: 50, category: 'Food', desc: 'Redeem for a tall fresh brewed coffee.' },
  { id: 'R-02', title: '$10 Amazon Gift Card', cost: 200, category: 'Shopping', desc: 'Get $10 added to your Amazon balance.' },
  { id: 'R-03', title: 'Transit 1-Day Pass', cost: 150, category: 'Transit', desc: 'Unlimited rides on city subways and buses for a day.' },
  { id: 'R-04', title: 'Eco Tote Bag', cost: 100, category: 'Eco Products', desc: 'A premium canvas bag made of 100% recycled cotton.' }
];

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('swms_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [userType, setUserType] = useState(() => {
    return localStorage.getItem('swms_user_type') || null;
  });

  const [bins, setBins] = useState(() => {
    const saved = localStorage.getItem('swms_bins');
    return saved ? JSON.parse(saved) : INITIAL_BINS;
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('swms_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [workers, setWorkers] = useState(() => {
    const saved = localStorage.getItem('swms_workers');
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });

  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('swms_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [citizenPoints, setCitizenPoints] = useState(() => {
    const saved = localStorage.getItem('swms_citizen_points');
    return saved ? parseInt(saved) : 120;
  });

  const [pointsHistory, setPointsHistory] = useState(() => {
    const saved = localStorage.getItem('swms_points_history');
    return saved ? JSON.parse(saved) : [
      { id: 'H-01', action: 'Recycled 10 Plastic Bottles', points: 50, date: '2026-06-18 15:40' },
      { id: 'H-02', action: 'Disposed Biodegradable Waste', points: 20, date: '2026-06-19 11:30' }
    ];
  });

  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // Sync to localStorage as local fallback
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('swms_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('swms_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (userType) {
      localStorage.setItem('swms_user_type', userType);
    } else {
      localStorage.removeItem('swms_user_type');
    }
  }, [userType]);

  useEffect(() => {
    localStorage.setItem('swms_bins', JSON.stringify(bins));
  }, [bins]);

  useEffect(() => {
    localStorage.setItem('swms_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('swms_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('swms_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('swms_citizen_points', citizenPoints.toString());
  }, [citizenPoints]);

  useEffect(() => {
    localStorage.setItem('swms_points_history', JSON.stringify(pointsHistory));
  }, [pointsHistory]);

  // Fetch initial data from json-server backend
  useEffect(() => {
    const syncWithBackend = async () => {
      try {
        const [binsRes, complaintsRes, workersRes, vehiclesRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/bins`),
          axios.get(`${BACKEND_URL}/complaints`),
          axios.get(`${BACKEND_URL}/workers`),
          axios.get(`${BACKEND_URL}/vehicles`)
        ]);
        setBins(binsRes.data);
        setComplaints(complaintsRes.data);
        setWorkers(workersRes.data);
        setVehicles(vehiclesRes.data);
        setIsBackendOnline(true);
        console.log('Smart Waste Management System synced with backend server database.');
      } catch (err) {
        console.warn('Backend json-server database is offline. Fallback active (utilizing localStorage states).');
        setIsBackendOnline(false);
      }
    };
    syncWithBackend();
  }, []);

  // Auth Operations
  const loginUser = (email, password, type) => {
    if (type === 'authority') {
      if (email === 'admin@municipal.gov' && password === 'admin123') {
        const adminUser = { email, name: 'Municipal Lead Administrator' };
        setCurrentUser(adminUser);
        setUserType('authority');
        return { success: true };
      }
      return { success: false, message: 'Invalid Admin credentials' };
    }

    if (type === 'worker') {
      const worker = workers.find(w => w.email === email);
      if (worker && password === 'worker123') {
        setCurrentUser(worker);
        setUserType('worker');
        return { success: true };
      }
      return { success: false, message: 'Invalid Worker credentials (try worker@eco.com / worker123)' };
    }

    if (type === 'public') {
      const citizens = JSON.parse(localStorage.getItem('swms_citizens') || '[]');
      const match = citizens.find(c => c.email === email && c.password === password) 
        || (email === 'citizen@eco.com' && password === 'citizen123' ? { email, name: 'Jane Doe' } : null);

      if (match) {
        setCurrentUser(match);
        setUserType('public');
        return { success: true };
      }
      return { success: false, message: 'Invalid Citizen credentials (try citizen@eco.com / citizen123 or Register)' };
    }

    return { success: false, message: 'Invalid portal selection' };
  };

  const registerUser = (name, email, password, type, extra = {}) => {
    if (type === 'public') {
      const citizens = JSON.parse(localStorage.getItem('swms_citizens') || '[]');
      if (citizens.some(c => c.email === email)) {
        return { success: false, message: 'Email already registered' };
      }
      const newCitizen = { name, email, password };
      citizens.push(newCitizen);
      localStorage.setItem('swms_citizens', JSON.stringify(citizens));
      
      setCurrentUser(newCitizen);
      setUserType('public');
      setCitizenPoints(100);
      setPointsHistory([
        { id: 'H-bonus', action: 'Sign-up Eco Bonus Points', points: 100, date: new Date().toISOString().replace('T', ' ').slice(0, 16) }
      ]);
      return { success: true };
    }

    if (type === 'worker') {
      if (workers.some(w => w.email === email)) {
        return { success: false, message: 'Worker email already registered' };
      }
      const newWorker = { email, name, truck: extra.truck || 'TRUCK-EcoX', status: 'Active', route: [] };
      
      // Auto register truck to vehicle database as well
      const newVehicle = { id: extra.truck || 'TRUCK-EcoX', model: 'Standard Compact Loader', driver: name, capacity: 500, load: 0, fuel: 'Diesel', status: 'Active' };
      
      setWorkers(prev => {
        const next = [...prev, newWorker];
        if (isBackendOnline) {
          axios.post(`${BACKEND_URL}/workers`, newWorker).catch(() => {});
        }
        return next;
      });

      setVehicles(prev => {
        const next = [...prev, newVehicle];
        if (isBackendOnline) {
          axios.post(`${BACKEND_URL}/vehicles`, newVehicle).catch(() => {});
        }
        return next;
      });

      setCurrentUser(newWorker);
      setUserType('worker');
      return { success: true };
    }

    if (type === 'authority') {
      return { success: false, message: 'Authority accounts cannot be self-registered.' };
    }

    return { success: false, message: 'Invalid type' };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setUserType(null);
  };

  // State modification operations with REST sync
  const addComplaint = async (title, desc, lat, lng, type, reporter, photo = null) => {
    const newComp = {
      id: `COMP-${Math.floor(100 + Math.random() * 900)}`,
      title,
      desc,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      type,
      status: 'Pending',
      reporter,
      photo,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    
    setComplaints(prev => [newComp, ...prev]);

    if (isBackendOnline) {
      try {
        await axios.post(`${BACKEND_URL}/complaints`, newComp);
      } catch (err) {
        console.warn('API error while adding complaint: saved locally.');
      }
    }
    return newComp;
  };

  const updateComplaintStatus = async (id, status, workerEmail = null) => {
    let updatedComplaint = null;

    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        updatedComplaint = { ...c, status };
        if (workerEmail) updatedComplaint.assignedTo = workerEmail;
        return updatedComplaint;
      }
      return c;
    }));

    if (isBackendOnline && updatedComplaint) {
      try {
        await axios.put(`${BACKEND_URL}/complaints/${id}`, updatedComplaint);
      } catch (err) {
        console.warn('API error updating ticket: saved locally.');
      }
    }
  };

  const addBin = async (name, lat, lng, type, capacity) => {
    const newBin = {
      id: `BIN-0${bins.length + 1}`,
      name,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      fillLevel: 0,
      type,
      capacity: parseInt(capacity),
      lastEmptied: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setBins(prev => [...prev, newBin]);

    if (isBackendOnline) {
      try {
        await axios.post(`${BACKEND_URL}/bins`, newBin);
      } catch (err) {
        console.warn('API error registering bin: saved locally.');
      }
    }
    return newBin;
  };

  const updateBinFillLevel = async (id, level) => {
    const nextLevel = Math.min(Math.max(0, level), 100);
    setBins(prev => prev.map(b => b.id === id ? { ...b, fillLevel: nextLevel } : b));

    if (isBackendOnline) {
      try {
        await axios.patch(`${BACKEND_URL}/bins/${id}`, { fillLevel: nextLevel });
      } catch (err) {
        console.warn('API error patching fill level: saved locally.');
      }
    }
  };

  const assignRoute = async (workerEmail, binIds) => {
    setWorkers(prev => prev.map(w => w.email === workerEmail ? { ...w, route: binIds } : w));
    if (currentUser && currentUser.email === workerEmail) {
      setCurrentUser(prev => ({ ...prev, route: binIds }));
    }

    if (isBackendOnline) {
      try {
        await axios.patch(`${BACKEND_URL}/workers/${workerEmail}`, { route: binIds });
      } catch (err) {
        console.warn('API error dispatching route: saved locally.');
      }
    }
  };

  const addStaff = async (name, email, truck) => {
    if (workers.some(w => w.email === email)) {
      return { success: false, message: 'Staff email already registered' };
    }
    const newStaff = { email, name, truck: truck === 'Unassigned' ? '' : truck, status: 'Active', route: [] };
    setWorkers(prev => [...prev, newStaff]);

    if (truck !== 'Unassigned') {
      updateVehicleStatus(truck, 'Active', name);
    }

    if (isBackendOnline) {
      try {
        await axios.post(`${BACKEND_URL}/workers`, newStaff);
      } catch (err) {
        console.warn('API error registering staff: saved locally.');
      }
    }
    return { success: true };
  };

  const addVehicle = async (id, model, driver, capacity, fuel) => {
    const newVehicle = { id, model, driver, capacity: parseInt(capacity), load: 0, fuel, status: 'Idle' };
    setVehicles(prev => [...prev, newVehicle]);

    if (isBackendOnline) {
      try {
        await axios.post(`${BACKEND_URL}/vehicles`, newVehicle);
      } catch (err) {
        console.warn('API error registering vehicle: saved locally.');
      }
    }
    return newVehicle;
  };

  const updateVehicleStatus = async (id, status, driver = null) => {
    let updatedVehicle = null;
    setVehicles(prev => prev.map(v => {
      if (v.id === id) {
        updatedVehicle = { ...v, status };
        if (driver) updatedVehicle.driver = driver;
        return updatedVehicle;
      }
      return v;
    }));

    if (isBackendOnline && updatedVehicle) {
      try {
        await axios.put(`${BACKEND_URL}/vehicles/${id}`, updatedVehicle);
      } catch (err) {
        console.warn('API error updating vehicle: saved locally.');
      }
    }
  };

  const completeCollection = async (workerEmail, binId) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    
    // Reset bin fillLevel locally
    setBins(prev => prev.map(b => b.id === binId ? {
      ...b,
      fillLevel: 0,
      lastEmptied: timestamp
    } : b));

    // Clear route from driver locally
    let nextRoute = [];
    setWorkers(prev => prev.map(w => {
      if (w.email === workerEmail) {
        nextRoute = w.route.filter(id => id !== binId);
        if (currentUser && currentUser.email === workerEmail) {
          setCurrentUser(prevUser => ({ ...prevUser, route: nextRoute }));
        }
        return { ...w, route: nextRoute };
      }
      return w;
    }));

    if (isBackendOnline) {
      try {
        const binTarget = bins.find(b => b.id === binId);
        if (binTarget) {
          await axios.put(`${BACKEND_URL}/bins/${binId}`, {
            ...binTarget,
            fillLevel: 0,
            lastEmptied: timestamp
          });
        }
        await axios.patch(`${BACKEND_URL}/workers/${workerEmail}`, { route: nextRoute });
      } catch (err) {
        console.warn('API error completing collection: saved locally.');
      }
    }
  };

  const earnPoints = (action, points) => {
    setCitizenPoints(prev => prev + points);
    const newHist = {
      id: `H-${Math.floor(100 + Math.random() * 900)}`,
      action,
      points,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setPointsHistory(prev => [newHist, ...prev]);
  };

  const redeemReward = (rewardId) => {
    const reward = REWARDS_CATALOG.find(r => r.id === rewardId);
    if (!reward) return { success: false, message: 'Reward not found' };
    if (citizenPoints < reward.cost) return { success: false, message: 'Insufficient points balance' };

    setCitizenPoints(prev => prev - reward.cost);
    const newHist = {
      id: `H-${Math.floor(100 + Math.random() * 900)}`,
      action: `Redeemed: ${reward.title}`,
      points: -reward.cost,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setPointsHistory(prev => [newHist, ...prev]);
    return { success: true, code: `VOUCHER-${Math.floor(100000 + Math.random() * 900000)}` };
  };

  // Mock interval to simulate bin filling rates periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setBins(prev => prev.map(b => {
        const increment = Math.random() * 1.5;
        const newLevel = Math.min(b.fillLevel + increment, 100);
        const rounded = Math.round(newLevel);
        
        if (isBackendOnline && rounded !== b.fillLevel) {
          axios.patch(`${BACKEND_URL}/bins/${b.id}`, { fillLevel: rounded }).catch(() => {});
        }
        
        return { ...b, fillLevel: rounded };
      }));
    }, 20000);

    return () => clearInterval(interval);
  }, [isBackendOnline]);

  return (
    <AppContext.Provider value={{
      currentUser,
      userType,
      bins,
      complaints,
      workers,
      vehicles,
      citizenPoints,
      pointsHistory,
      rewardsCatalog: REWARDS_CATALOG,
      loginUser,
      registerUser,
      logoutUser,
      addComplaint,
      updateComplaintStatus,
      addBin,
      updateBinFillLevel,
      assignRoute,
      addStaff,
      addVehicle,
      updateVehicleStatus,
      completeCollection,
      earnPoints,
      redeemReward
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
