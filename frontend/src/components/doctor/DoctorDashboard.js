import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { FaCalendarAlt, FaUserCog, FaClock, FaClipboardList } from 'react-icons/fa';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await doctorAPI.getAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = appointments.filter((a) => a.status === 'PENDING').length;
  const todayCount = appointments.filter(
    (a) => a.appointmentDate === new Date().toISOString().split('T')[0] &&
           (a.status === 'ACCEPTED' || a.status === 'PENDING')
  ).length;

  return (
    <div className="dashboard">
      <h1>Welcome, Dr. {user?.fullName}!</h1>
      <p className="dashboard-subtitle">Manage your appointments and schedule</p>

      <div className="dashboard-cards">
        <Link to="/doctor/appointments" className="dashboard-card">
          <FaCalendarAlt className="card-icon" />
          <h3>Appointments</h3>
          <p>View and manage appointments</p>
        </Link>
        <Link to="/doctor/profile" className="dashboard-card">
          <FaUserCog className="card-icon" />
          <h3>My Profile</h3>
          <p>Update your profile info</p>
        </Link>
        <Link to="/doctor/slots" className="dashboard-card">
          <FaClock className="card-icon" />
          <h3>Time Slots</h3>
          <p>Manage your availability</p>
        </Link>
        <div className="dashboard-card stats">
          <FaClipboardList className="card-icon" />
          <h3>Pending</h3>
          <p className="stat-number">{pendingCount}</p>
          <p>requests</p>
        </div>
      </div>

      {!loading && (
        <div className="dashboard-stats-row">
          <div className="stat-box">
            <h3>Today's Appointments</h3>
            <p className="stat-number">{todayCount}</p>
          </div>
          <div className="stat-box">
            <h3>Total Appointments</h3>
            <p className="stat-number">{appointments.length}</p>
          </div>
          <div className="stat-box">
            <h3>Pending Requests</h3>
            <p className="stat-number">{pendingCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
