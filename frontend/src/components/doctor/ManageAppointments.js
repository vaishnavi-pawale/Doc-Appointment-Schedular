import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { doctorAPI } from '../../api/api';
import { FaCalendarAlt, FaCheck, FaTimes, FaClipboardCheck, FaStickyNote } from 'react-icons/fa';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [noteModal, setNoteModal] = useState({ open: false, appointmentId: null, notes: '' });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await doctorAPI.getAppointments();
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await doctorAPI.updateAppointmentStatus(id, status);
      toast.success(`Appointment ${status.toLowerCase()}`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSaveNotes = async () => {
    try {
      await doctorAPI.addNotes(noteModal.appointmentId, noteModal.notes);
      toast.success('Notes saved');
      setNoteModal({ open: false, appointmentId: null, notes: '' });
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to save notes');
    }
  };

  const filteredAppointments = filter === 'ALL'
    ? appointments
    : appointments.filter((a) => a.status === filter);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="manage-appointments">
      <h1><FaCalendarAlt /> Manage Appointments</h1>

      <div className="filter-tabs">
        {['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED', 'REJECTED'].map((status) => (
          <button
            key={status}
            className={`filter-tab ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status}
            {status === 'PENDING' && (
              <span className="badge">{appointments.filter((a) => a.status === 'PENDING').length}</span>
            )}
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
            <div key={apt.id} className="appointment-card doctor-view">
              <div className="appointment-info">
                <h4>{apt.patientName}</h4>
                <p className="email">{apt.patientEmail}</p>
                <p className="datetime">
                  {apt.appointmentDate} | {apt.startTime} - {apt.endTime}
                </p>
                {apt.reason && <p className="reason">Reason: {apt.reason}</p>}
                {apt.notes && <p className="notes">Notes: {apt.notes}</p>}
              </div>
              <div className="appointment-actions">
                <span className={`status-badge ${apt.status.toLowerCase()}`}>
                  {apt.status}
                </span>
                <div className="action-buttons">
                  {apt.status === 'PENDING' && (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatusUpdate(apt.id, 'ACCEPTED')}
                      >
                        <FaCheck /> Accept
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusUpdate(apt.id, 'REJECTED')}
                      >
                        <FaTimes /> Reject
                      </button>
                    </>
                  )}
                  {apt.status === 'ACCEPTED' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleStatusUpdate(apt.id, 'COMPLETED')}
                    >
                      <FaClipboardCheck /> Complete
                    </button>
                  )}
                  {(apt.status === 'ACCEPTED' || apt.status === 'COMPLETED') && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setNoteModal({
                        open: true,
                        appointmentId: apt.id,
                        notes: apt.notes || '',
                      })}
                    >
                      <FaStickyNote /> Notes
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notes Modal */}
      {noteModal.open && (
        <div className="modal-overlay" onClick={() => setNoteModal({ open: false, appointmentId: null, notes: '' })}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Notes</h3>
            <textarea
              value={noteModal.notes}
              onChange={(e) => setNoteModal({ ...noteModal, notes: e.target.value })}
              placeholder="Add consultation notes..."
              rows="5"
            />
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleSaveNotes}>Save</button>
              <button
                className="btn btn-secondary"
                onClick={() => setNoteModal({ open: false, appointmentId: null, notes: '' })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAppointments;
