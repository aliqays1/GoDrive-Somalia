import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CarsList from './pages/CarsList';
import CarDetails from './pages/CarDetails';
import BookingPage from './pages/BookingPage';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import GuardScannerPage from './pages/GuardScannerPage';
import EmployeePortal from './pages/EmployeePortal';
import AuditorPortal from './pages/AuditorPortal';
import AuthPage from './pages/AuthPage';
import PassPage from './pages/PassPage';

export default function App() {
  const location = useLocation();
  const isPortal = ['/admin', '/employee', '/auditor', '/guard-gate'].includes(location.pathname) || location.pathname.startsWith('/pass');

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 font-sans">
      {!isPortal && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<CarsList />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/my-bookings" element={<CustomerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/employee" element={<EmployeePortal />} />
          <Route path="/auditor" element={<AuditorPortal />} />
          <Route path="/guard-gate" element={<GuardScannerPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pass/:id" element={<PassPage />} />
        </Routes>
      </main>
      {!isPortal && <Footer />}
    </div>
  );
}
