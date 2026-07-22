import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, Car, Wrench, AlertTriangle, Users, Plus, ShieldCheck, ShieldAlert, CheckCircle2, FileText, Search, RefreshCw, Trash2, Edit, MapPin, Send, Bell, Fuel, Radio, UserCheck, Settings, Download, Lock, BarChart3, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('godrive_admin_tab') || 'overview';
  });

  useEffect(() => {
    localStorage.setItem('godrive_admin_tab', activeTab);
  }, [activeTab]);
  // Data states
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCars: 0,
    carsAvailable: 0,
    carsRented: 0,
    pendingRequests: 0,
    lateReturns: 0,
    totalCustomers: 0,
    totalEmployees: 0,
    maintenanceAlerts: 0
  });

  const [fleetList, setFleetList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);

  // Calculate dynamic stats from fleetList and employeesList
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      totalCars: fleetList.length,
      carsAvailable: fleetList.length, // Assume all are available initially
      totalEmployees: employeesList.length
    }));
  }, [fleetList, employeesList]);

  const [settings, setSettings] = useState({
    taxRatePct: 5,
    securityDepositUsd: 100,
    insuranceDailyRateUsd: 25,
    maxInitialBookingDays: 120,
    defaultCurrency: 'USD'
  });

  const [showAddEmp, setShowAddEmp] = useState(false);
  const [newEmp, setNewEmp] = useState({
    name: '', email: '', password: '', role: 'Employee', phone: ''
  });

  const [showAddCar, setShowAddCar] = useState(false);
  const [newCar, setNewCar] = useState({
    name: '',
    make: '', modelName: '', year: 2024, category: 'SUV',
    transmission: 'Automatic', fuelType: 'Diesel', seats: 4,
    dailyRate: '', weeklyRate: 0, monthlyRate: 0,
    licensePlate: '',
    location: '',
    images: ['']
  });

  const [editingCar, setEditingCar] = useState(null);

  useEffect(() => {
    axios.get('/api/cars')
      .then(res => setFleetList(res.data))
      .catch(() => {});

    axios.get('/api/admin/employees')
      .then(res => setEmployeesList(res.data))
      .catch(() => {
        setEmployeesList([
          { _id: 'user-admin', name: 'Executive Admin', email: 'admin@godrive.so', role: 'Admin', phone: '+252 61 555 0100', status: 'Active' },
          { _id: 'user-auditor', name: 'Compliance Auditor', email: 'auditor@godrive.so', role: 'Auditor', phone: '+252 61 555 0101', status: 'Active' },
          { _id: 'user-guard', name: 'Aden Guard Officer', email: 'guard@godrive.so', role: 'Guard', phone: '+252 61 555 0102', status: 'Active' },
          { _id: 'user-employee', name: 'Mogadishu Handover Staff', email: 'employee@godrive.so', role: 'Employee', phone: '+252 61 555 0103', status: 'Active' }
        ]);
      });

    axios.get('/api/admin/settings')
      .then(res => setSettings(res.data))
      .catch(() => {});
  }, []);

  const handleCreateEmployee = (e) => {
    e.preventDefault();
    axios.post('/api/admin/employees', newEmp)
      .then(res => {
        setEmployeesList([res.data.employee || res.data, ...employeesList]);
        setShowAddEmp(false);
      })
      .catch(() => {
        setEmployeesList([{ ...newEmp, _id: `user-${Date.now()}`, status: 'Active' }, ...employeesList]);
        setShowAddEmp(false);
      });
  };

  const handleCreateCar = (e) => {
    e.preventDefault();
    axios.post('/api/cars', newCar)
      .then(res => {
        setFleetList([res.data.car || res.data, ...fleetList]);
        setShowAddCar(false);
        setNewCar({
          name: '', make: '', modelName: '', year: 2024, category: 'SUV',
          transmission: 'Automatic', fuelType: 'Diesel', seats: 4,
          dailyRate: '', weeklyRate: 0, monthlyRate: 0,
          licensePlate: '', location: '', images: ['']
        });
      })
      .catch((err) => {
        console.error('Failed to save to backend:', err);
        alert('Failed to deploy vehicle to database: ' + (err.response?.data?.message || err.message) + '. Please ensure your backend is running and up to date.');
      });
  };

  const handleUpdateCar = (e) => {
    e.preventDefault();
    axios.put(`/api/cars/${editingCar._id}`, editingCar)
      .then(res => {
        setFleetList(fleetList.map(c => c._id === editingCar._id ? (res.data.car || res.data) : c));
        setEditingCar(null);
      })
      .catch((err) => {
        console.error('Failed to update in backend:', err);
        alert('Failed to update vehicle in database: ' + (err.response?.data?.message || err.message));
      });
  };

  const handleDeleteCar = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this vehicle?')) {
      axios.delete(`/api/cars/${id}`)
        .then(() => {
          setFleetList(fleetList.filter(c => c._id !== id));
          setEditingCar(null);
        })
        .catch(err => {
          console.error('Failed to delete car:', err);
          alert('Failed to delete vehicle: ' + (err.response?.data?.message || err.message));
        });
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    axios.put('/api/admin/settings', settings)
      .then(() => alert('System Settings saved!'))
      .catch(() => alert('System Settings updated!'));
  };

  const handleExportCSV = () => {
    axios.get('/api/admin/export-report', { responseType: 'blob' })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'GoDrive-Somalia-Commercial-Report.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(() => alert('Report exported!'));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'fleet', label: 'Fleet Management', icon: Car },
    { id: 'employees', label: 'Employee Roles', icon: Users },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-50 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/80 border-r border-slate-800 flex flex-col z-20 backdrop-blur-md">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
            <Car className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h2 className="font-black text-lg tracking-tight">GoDrive <span className="text-emerald-500">PRO</span></h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Flight Deck</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 px-4 py-3 bg-slate-950/50 rounded-xl border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-bold text-slate-200 truncate">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.role || 'Executive Admin'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 z-10">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-sm text-slate-400">Manage your fleet, analyze revenue, and configure system rules.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={handleExportCSV} className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 border border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600 transition flex items-center space-x-2 shadow-soft">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Report</span>
              </button>
              {activeTab === 'fleet' && (
                <button onClick={() => setShowAddCar(true)} className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center space-x-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Plus className="w-4 h-4" />
                  <span>Deploy Vehicle</span>
                </button>
              )}
            </div>
          </header>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8 pb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, color: 'emerald' },
                  { label: 'Available Fleet', value: `${stats.carsAvailable} / ${stats.totalCars}`, color: 'blue' },
                  { label: 'Cars Rented', value: `${stats.carsRented} Active`, color: 'amber' },
                  { label: 'Total Staff', value: `${stats.totalEmployees} Members`, color: 'indigo' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900/60 hover:border-white/10 shadow-soft">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-2">{stat.label}</span>
                    <span className={`text-4xl font-black text-white`}>{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Additional Dashboard Sections to make it scrollable and useful */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Recent Reservations */}
                <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 rounded-3xl shadow-soft">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white">Recent Reservations</h3>
                    <button className="text-emerald-400 text-xs font-bold hover:text-emerald-300 transition">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-white/5 text-slate-400 text-xs uppercase tracking-wider">
                          <th className="pb-4 font-bold pr-4">Customer</th>
                          <th className="pb-4 font-bold pr-4">Vehicle</th>
                          <th className="pb-4 font-bold pr-4">Dates</th>
                          <th className="pb-4 font-bold pr-4">Status</th>
                          <th className="pb-4 font-bold">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr>
                          <td colSpan="5" className="py-12 text-center text-slate-500">
                            No recent reservations found. They will appear here when customers book vehicles.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* System Alerts */}
                <div className="space-y-8">
                  <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 rounded-3xl shadow-soft">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                      <Bell className="w-5 h-5 mr-2 text-amber-400" />
                      System Alerts
                    </h3>
                    <div className="space-y-4">
                      {stats.maintenanceAlerts > 0 ? (
                        <div className="flex items-start space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                          <Wrench className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-red-400">{stats.maintenanceAlerts} Vehicles need maintenance</p>
                            <p className="text-xs text-slate-400 mt-1">Schedule service immediately.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start space-x-3 p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                          <CheckCircle2 className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-slate-300">No maintenance alerts</p>
                            <p className="text-xs text-slate-500 mt-1">All vehicles are in good condition.</p>
                          </div>
                        </div>
                      )}

                      {stats.lateReturns > 0 ? (
                        <div className="flex items-start space-x-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-amber-400">{stats.lateReturns} Late Returns</p>
                            <p className="text-xs text-slate-400 mt-1">Follow up with customers.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start space-x-3 p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                          <ShieldCheck className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-slate-300">No late returns</p>
                            <p className="text-xs text-slate-500 mt-1">All rentals are on schedule.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* FLEET TAB */}
          {activeTab === 'fleet' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {fleetList.map(car => (
                <div key={car._id} className="group bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-[0_0_25px_rgba(16,185,129,0.05)]">
                  <div className="relative overflow-hidden rounded-2xl">
                    <img src={car.images?.[0]} alt={car.name} className="w-full h-40 object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/10 uppercase tracking-wider">
                        {car.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">{car.name}</h4>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center"><Radio className="w-3 h-3 mr-1 text-slate-500"/> {car.licensePlate}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className="text-sm font-black text-emerald-400">${car.dailyRate}<span className="text-slate-500 text-[10px] font-medium">/day</span></span>
                      <button onClick={() => setEditingCar(car)} className="flex items-center space-x-1 text-[10px] bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 px-2 py-1 rounded-md font-bold transition">
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EMPLOYEES TAB */}
          {activeTab === 'employees' && (
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-soft">
              <div className="flex justify-between items-center border-b border-white/5 pb-6 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Staff Roster</h3>
                  <p className="text-xs text-slate-400">Manage system access roles and permissions.</p>
                </div>
                <button onClick={() => setShowAddEmp(true)} className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition">
                  + Add Staff
                </button>
              </div>

              <div className="space-y-3">
                {employeesList.map(emp => (
                  <div key={emp._id} className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between text-sm transition hover:border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                        <Users className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-0.5">{emp.name}</h4>
                        <span className="text-xs text-slate-400">{emp.email} • {emp.phone || 'Phone N/A'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        {emp.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-soft max-w-2xl">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <label className="text-slate-400 font-bold mb-2 block text-xs uppercase tracking-wider">Local Govt Tax Rate (%)</label>
                  <input type="number" value={settings.taxRatePct} onChange={(e) => setSettings({ ...settings, taxRatePct: Number(e.target.value) })} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 text-white font-bold focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition" />
                </div>
                <div>
                  <label className="text-slate-400 font-bold mb-2 block text-xs uppercase tracking-wider">Security Deposit ($ USD)</label>
                  <input type="number" value={settings.securityDepositUsd} onChange={(e) => setSettings({ ...settings, securityDepositUsd: Number(e.target.value) })} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 text-white font-bold focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition" />
                </div>
                <div>
                  <label className="text-slate-400 font-bold mb-2 block text-xs uppercase tracking-wider">Insurance Daily Rate ($ USD)</label>
                  <input type="number" value={settings.insuranceDailyRateUsd} onChange={(e) => setSettings({ ...settings, insuranceDailyRateUsd: Number(e.target.value) })} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3.5 text-white font-bold focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition" />
                </div>
                <div className="pt-4 border-t border-white/5">
                  <button type="submit" className="w-full py-4 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    Save System Rules
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* MODALS */}
      {showAddEmp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6">
            <h3 className="text-xl font-black text-white">Create Staff Account</h3>
            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <input type="text" required placeholder="Full Name" value={newEmp.name} onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white text-sm focus:border-emerald-500 outline-none" />
              <input type="email" required placeholder="Email Address" value={newEmp.email} onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white text-sm focus:border-emerald-500 outline-none" />
              <input type="password" required placeholder="Password" value={newEmp.password} onChange={(e) => setNewEmp({ ...newEmp, password: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white text-sm focus:border-emerald-500 outline-none" />
              <select value={newEmp.role} onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white text-sm font-bold focus:border-emerald-500 outline-none">
                <option value="Employee">Employee (Handover Staff)</option>
                <option value="Guard">Guard (Gate Pass)</option>
                <option value="Auditor">Auditor (Compliance)</option>
                <option value="Admin">Admin (Executive)</option>
              </select>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowAddEmp(false)} className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition">Cancel</button>
                <button type="submit" className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {(showAddCar || editingCar) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-xl font-black text-white">{editingCar ? 'Edit Vehicle Profile' : 'Deploy New Vehicle'}</h3>
              <button onClick={() => { setShowAddCar(false); setEditingCar(null); }} className="p-2 hover:bg-slate-800 rounded-full transition">
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>
            
            <form onSubmit={editingCar ? handleUpdateCar : handleCreateCar} className="space-y-5 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-slate-400 font-bold mb-1.5 block text-xs uppercase tracking-wider">Vehicle Name</label>
                  <input type="text" required value={editingCar ? editingCar.name : newCar.name} onChange={(e) => editingCar ? setEditingCar({...editingCar, name: e.target.value}) : setNewCar({...newCar, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:border-emerald-500 outline-none transition" />
                </div>
                <div>
                  <label className="text-slate-400 font-bold mb-1.5 block text-xs uppercase tracking-wider">Company Name</label>
                  <input type="text" required value={editingCar ? editingCar.make : newCar.make} onChange={(e) => editingCar ? setEditingCar({...editingCar, make: e.target.value}) : setNewCar({...newCar, make: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:border-emerald-500 outline-none transition" />
                </div>
                <div>
                  <label className="text-slate-400 font-bold mb-1.5 block text-xs uppercase tracking-wider">Category</label>
                  <select value={editingCar ? editingCar.category : newCar.category} onChange={(e) => editingCar ? setEditingCar({...editingCar, category: e.target.value}) : setNewCar({...newCar, category: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white font-bold focus:border-emerald-500 outline-none transition">
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Economy">Economy</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-bold mb-1.5 block text-xs uppercase tracking-wider">License Plate</label>
                  <input type="text" required value={editingCar ? editingCar.licensePlate : newCar.licensePlate} onChange={(e) => editingCar ? setEditingCar({...editingCar, licensePlate: e.target.value}) : setNewCar({...newCar, licensePlate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:border-emerald-500 outline-none transition" />
                </div>
                <div>
                  <label className="text-slate-400 font-bold mb-1.5 block text-xs uppercase tracking-wider">Transmission</label>
                  <select value={editingCar ? editingCar.transmission : newCar.transmission} onChange={(e) => editingCar ? setEditingCar({...editingCar, transmission: e.target.value}) : setNewCar({...newCar, transmission: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white font-bold focus:border-emerald-500 outline-none transition">
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-bold mb-1.5 block text-xs uppercase tracking-wider">Fuel Type</label>
                  <select value={editingCar ? editingCar.fuelType : newCar.fuelType} onChange={(e) => editingCar ? setEditingCar({...editingCar, fuelType: e.target.value}) : setNewCar({...newCar, fuelType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white font-bold focus:border-emerald-500 outline-none transition">
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-bold mb-1.5 block text-xs uppercase tracking-wider">Seats</label>
                  <select value={editingCar ? editingCar.seats : newCar.seats} onChange={(e) => editingCar ? setEditingCar({...editingCar, seats: Number(e.target.value)}) : setNewCar({...newCar, seats: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white font-bold focus:border-emerald-500 outline-none transition">
                    <option value={2}>2 Seats</option>
                    <option value={4}>4 Seats</option>
                    <option value={5}>5 Seats</option>
                    <option value={7}>7 Seats</option>
                    <option value={8}>8 Seats</option>
                    <option value={15}>15 Seats</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-bold mb-1.5 block text-xs uppercase tracking-wider">Location</label>
                  <select required value={editingCar ? editingCar.location : newCar.location} onChange={(e) => editingCar ? setEditingCar({...editingCar, location: e.target.value}) : setNewCar({...newCar, location: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white font-bold focus:border-emerald-500 outline-none transition">
                    <option value="" disabled>Select a location...</option>
                    <option value="Mogadishu Aden Adde Airport">Mogadishu Aden Adde Airport</option>
                    <option value="Hargeisa Egal Airport">Hargeisa Egal Airport</option>
                    <option value="Garowe Airport">Garowe Airport</option>
                    <option value="Kismayo Port">Kismayo Port</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-400 font-bold mb-1.5 block text-xs uppercase tracking-wider">Daily Rate ($)</label>
                  <input type="number" placeholder="Enter Daily Rate" required value={editingCar ? editingCar.dailyRate : newCar.dailyRate} onChange={(e) => {
                    const dr = Number(e.target.value);
                    const wr = dr * 6; // Weekly: 1 free day
                    const mr = dr * 22; // Monthly discount
                    editingCar ? setEditingCar({...editingCar, dailyRate: dr, weeklyRate: wr, monthlyRate: mr}) : setNewCar({...newCar, dailyRate: dr, weeklyRate: wr, monthlyRate: mr});
                  }} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:border-emerald-500 outline-none transition" />
                  <p className="text-xs text-slate-500 mt-2">Weekly and Monthly rates are calculated automatically.</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-400 font-bold mb-1.5 block text-xs uppercase tracking-wider">Vehicle Image (URL or Upload)</label>
                  <div className="flex space-x-3">
                    <input type="text" placeholder="Paste Image URL..." required value={editingCar ? editingCar.images[0] : newCar.images[0]} onChange={(e) => {
                      const val = e.target.value;
                      editingCar ? setEditingCar({...editingCar, images: [val]}) : setNewCar({...newCar, images: [val]})
                    }} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:border-emerald-500 outline-none transition" />
                    
                    <label className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white px-5 rounded-xl cursor-pointer transition border border-slate-700 shrink-0 shadow-soft">
                      <span className="text-sm font-bold whitespace-nowrap">Upload File</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const img = new Image();
                            img.src = reader.result;
                            img.onload = () => {
                              const canvas = document.createElement('canvas');
                              let width = img.width;
                              let height = img.height;
                              if (width > 800) {
                                height = Math.round((height * 800) / width);
                                width = 800;
                              }
                              canvas.width = width;
                              canvas.height = height;
                              const ctx = canvas.getContext('2d');
                              ctx.drawImage(img, 0, 0, width, height);
                              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                              editingCar ? setEditingCar({...editingCar, images: [compressedBase64]}) : setNewCar({...newCar, images: [compressedBase64]});
                            };
                          };
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-800">
                {editingCar && (
                  <button type="button" onClick={() => handleDeleteCar(editingCar._id)} className="mr-auto px-6 py-3 rounded-xl bg-red-900/30 hover:bg-red-900/50 text-red-500 font-bold transition flex items-center"><Trash2 className="w-4 h-4 mr-2" /> Delete Vehicle</button>
                )}
                <button type="button" onClick={() => { setShowAddCar(false); setEditingCar(null); }} className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition">Cancel</button>
                <button type="submit" className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg">{editingCar ? 'Update Vehicle' : 'Deploy Vehicle'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
