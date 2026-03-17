import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { FaUserMd, FaCalendarAlt, FaChartBar } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [doctorsRes, appointmentsRes] = await Promise.all([
        adminAPI.getAllDoctors(),
        adminAPI.getAllAppointments(),
      ]);
      setDoctors(doctorsRes.data);
      setAppointments(appointmentsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  const statusCounts = appointments.reduce((acc, apt) => {
    acc[apt.status] = (acc[apt.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p className="dashboard-subtitle">Welcome, {user?.fullName}</p>

      <div className="dashboard-stats-row">
        <div className="stat-box">
          <FaUserMd className="stat-icon" />
          <h3>Total Doctors</h3>
          <p className="stat-number">{doctors.length}</p>
        </div>
        <div className="stat-box">
          <FaCalendarAlt className="stat-icon" />
          <h3>Total Appointments</h3>
          <p className="stat-number">{appointments.length}</p>
        </div>
        <div className="stat-box">
          <FaChartBar className="stat-icon" />
          <h3>Pending</h3>
          <p className="stat-number">{statusCounts.PENDING || 0}</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'doctors' ? 'active' : ''}`}
          onClick={() => setActiveTab('doctors')}
        >
          Doctors ({doctors.length})
        </button>
        <button
          className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments ({appointments.length})
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="overview-grid">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="overview-card">
              <h4>{status}</h4>
              <p className="stat-number">{count}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'doctors' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Fee</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.id}>
                  <td>Dr. {doc.fullName}</td>
                  <td>{doc.email}</td>
                  <td>{doc.specialization}</td>
                  <td>{doc.experienceYears} yrs</td>
                  <td>${doc.consultationFee || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id}>
                  <td>{apt.patientName}</td>
                  <td>Dr. {apt.doctorName}</td>
                  <td>{apt.appointmentDate}</td>
                  <td>{apt.startTime} - {apt.endTime}</td>
                  <td>
                    <span className={`status-badge ${apt.status.toLowerCase()}`}>
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
