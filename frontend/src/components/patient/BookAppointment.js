import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doctorAPI, patientAPI } from '../../api/api';
import { FaUserMd, FaCalendarAlt, FaClock } from 'react-icons/fa';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    startTime: '',
    endTime: '',
    reason: '',
  });

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      const response = await doctorAPI.getById(doctorId);
      setDoctor(response.data);
    } catch (error) {
      toast.error('Doctor not found');
      navigate('/doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    // When date changes, reset time selection
    if (name === 'appointmentDate') {
      updated.startTime = '';
      updated.endTime = '';
    }

    setFormData(updated);
  };

  const handleSlotSelect = (slot) => {
    setFormData({
      ...formData,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBooking(true);
    try {
      await patientAPI.bookAppointment({
        doctorId: parseInt(doctorId),
        ...formData,
      });
      toast.success('Appointment booked successfully!');
      navigate('/my-appointments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setBooking(false);
    }
  };

  // Get day of week from selected date
  const selectedDaySlots = formData.appointmentDate && doctor
    ? doctor.timeSlots?.filter((slot) => {
        const date = new Date(formData.appointmentDate + 'T00:00:00');
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return slot.dayOfWeek === days[date.getDay()] && slot.available;
      })
    : [];

  // Auto-select slot when only one is available
  useEffect(() => {
    if (selectedDaySlots && selectedDaySlots.length === 1 && !formData.startTime) {
      setFormData((prev) => ({
        ...prev,
        startTime: selectedDaySlots[0].startTime,
        endTime: selectedDaySlots[0].endTime,
      }));
    }
  }, [formData.appointmentDate, doctor]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!doctor) return null;

  return (
    <div className="book-appointment">
      <h1>Book Appointment</h1>

      <div className="doctor-info-card">
        <div className="doctor-avatar large">
          <FaUserMd />
        </div>
        <div>
          <h2>Dr. {doctor.fullName}</h2>
          <p className="specialization">{doctor.specialization}</p>
          <p>{doctor.experienceYears} years experience</p>
          {doctor.consultationFee && <p className="fee">Fee: ${doctor.consultationFee}</p>}
          {doctor.about && <p className="about">{doctor.about}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label><FaCalendarAlt /> Select Date</label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        {formData.appointmentDate && selectedDaySlots.length > 0 && (
          <div className="form-group">
            <label><FaClock /> Available Slots</label>
            <div className="slot-grid">
              {selectedDaySlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  className={`slot-btn ${
                    formData.startTime === slot.startTime ? 'selected' : ''
                  }`}
                  onClick={() => handleSlotSelect(slot)}
                >
                  {slot.startTime} - {slot.endTime}
                </button>
              ))}
            </div>
          </div>
        )}

        {formData.appointmentDate && selectedDaySlots.length === 0 && (
          <p className="no-slots">No available slots for this day. Please select another date.</p>
        )}

        {formData.appointmentDate && selectedDaySlots.length === 0 && (
          <div className="form-row">
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Reason for Visit</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Describe your symptoms or reason for visit"
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={booking || !formData.appointmentDate || !formData.startTime || !formData.endTime}
        >
          {booking ? 'Booking...' : 'Confirm Appointment'}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
