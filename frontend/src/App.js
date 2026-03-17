import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import PatientDashboard from './components/patient/PatientDashboard';
import DoctorSearch from './components/patient/DoctorSearch';
import BookAppointment from './components/patient/BookAppointment';
import AppointmentHistory from './components/patient/AppointmentHistory';
import PatientProfile from './components/patient/PatientProfile';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import DoctorProfile from './components/doctor/DoctorProfile';
import ManageSlots from './components/doctor/ManageSlots';
import ManageAppointments from './components/doctor/ManageAppointments';
import AdminDashboard from './components/admin/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />

          {/* Dashboard redirect based on role */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              {user?.role === 'ROLE_PATIENT' && <PatientDashboard />}
              {user?.role === 'ROLE_DOCTOR' && <DoctorDashboard />}
              {user?.role === 'ROLE_ADMIN' && <AdminDashboard />}
            </PrivateRoute>
          } />

          {/* Patient Routes */}
          <Route path="/doctors" element={
            <PrivateRoute role="ROLE_PATIENT"><DoctorSearch /></PrivateRoute>
          } />
          <Route path="/book-appointment/:doctorId" element={
            <PrivateRoute role="ROLE_PATIENT"><BookAppointment /></PrivateRoute>
          } />
          <Route path="/my-appointments" element={
            <PrivateRoute role="ROLE_PATIENT"><AppointmentHistory /></PrivateRoute>
          } />
          <Route path="/patient/profile" element={
            <PrivateRoute role="ROLE_PATIENT"><PatientProfile /></PrivateRoute>
          } />

          {/* Doctor Routes */}
          <Route path="/doctor/profile" element={
            <PrivateRoute role="ROLE_DOCTOR"><DoctorProfile /></PrivateRoute>
          } />
          <Route path="/doctor/slots" element={
            <PrivateRoute role="ROLE_DOCTOR"><ManageSlots /></PrivateRoute>
          } />
          <Route path="/doctor/appointments" element={
            <PrivateRoute role="ROLE_DOCTOR"><ManageAppointments /></PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute role="ROLE_ADMIN"><AdminDashboard /></PrivateRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
