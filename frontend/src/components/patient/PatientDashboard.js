import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { patientAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { FaCalendarAlt, FaUserMd, FaClipboardList } from 'react-icons/fa';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await patientAPI.getAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'PENDING' || a.status === 'ACCEPTED'
  );

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.fullName}!</h1>
      <p className="dashboard-subtitle">Manage your appointments and find doctors</p>

      <div className="dashboard-cards">
        <Link to="/doctors" className="dashboard-card">
          <FaUserMd className="card-icon" />
          <h3>Find Doctors</h3>
          <p>Search and book appointments with specialists</p>
        </Link>
        <Link to="/my-appointments" className="dashboard-card">
          <FaCalendarAlt className="card-icon" />
          <h3>My Appointments</h3>
          <p>View and manage your appointments</p>
        </Link>
        <div className="dashboard-card stats">
          <FaClipboardList className="card-icon" />
          <h3>Upcoming</h3>
          <p className="stat-number">{upcomingAppointments.length}</p>
          <p>appointments</p>
        </div>
      </div>

      {!loading && upcomingAppointments.length > 0 && (
        <div className="section">
          <h2>Upcoming Appointments</h2>
          <div className="appointment-list">
            {upcomingAppointments.slice(0, 3).map((apt) => (
              <div key={apt.id} className="appointment-card">
                <div className="appointment-info">
                  <h4>Dr. {apt.doctorName}</h4>
                  <p className="specialization">{apt.doctorSpecialization}</p>
                  <p>{apt.appointmentDate} | {apt.startTime} - {apt.endTime}</p>
                </div>
                <span className={`status-badge ${apt.status.toLowerCase()}`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
