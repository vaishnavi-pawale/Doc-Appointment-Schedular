import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { patientAPI } from '../../api/api';
import { FaCalendarAlt, FaTimes } from 'react-icons/fa';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await patientAPI.getAppointments();
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await patientAPI.cancelAppointment(id);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel');
    }
  };

  const filteredAppointments = filter === 'ALL'
    ? appointments
    : appointments.filter((a) => a.status === filter);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="appointment-history">
      <h1><FaCalendarAlt /> My Appointments</h1>

      <div className="filter-tabs">
        {['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED', 'REJECTED'].map((status) => (
          <button
            key={status}
            className={`filter-tab ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="empty-state">
          <FaCalendarAlt className="empty-icon" />
          <p>No appointments found.</p>
        </div>
      ) : (
        <div className="appointment-list">
          {filteredAppointments.map((apt) => (
            <div key={apt.id} className="appointment-card">
              <div className="appointment-info">
                <h4>Dr. {apt.doctorName}</h4>
                <p className="specialization">{apt.doctorSpecialization}</p>
                <p className="datetime">
                  {apt.appointmentDate} | {apt.startTime} - {apt.endTime}
                </p>
                {apt.reason && <p className="reason">Reason: {apt.reason}</p>}
                {apt.notes && <p className="notes">Doctor's Notes: {apt.notes}</p>}
              </div>
              <div className="appointment-actions">
                <span className={`status-badge ${apt.status.toLowerCase()}`}>
                  {apt.status}
                </span>
                {(apt.status === 'PENDING' || apt.status === 'ACCEPTED') && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleCancel(apt.id)}
                  >
                    <FaTimes /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;
