import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { doctorAPI } from '../../api/api';
import { FaClock, FaPlus, FaTrash } from 'react-icons/fa';

const ManageSlots = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '09:30',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await doctorAPI.getProfile();
      setDoctor(response.data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await doctorAPI.addTimeSlot(newSlot);
      setDoctor(response.data);
      toast.success('Time slot added!');
    } catch (error) {
      toast.error('Failed to add time slot');
    }
  };

  const handleDelete = async (slotId) => {
    if (!window.confirm('Delete this time slot?')) return;
    try {
      await doctorAPI.deleteTimeSlot(slotId);
      fetchProfile();
      toast.success('Time slot deleted');
    } catch (error) {
      toast.error('Failed to delete time slot');
    }
  };

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  if (loading) return <div className="loading">Loading...</div>;

  // Group slots by day
  const slotsByDay = {};
  days.forEach((day) => {
    slotsByDay[day] = doctor?.timeSlots?.filter((s) => s.dayOfWeek === day) || [];
  });

  return (
    <div className="manage-slots">
      <h1><FaClock /> Manage Time Slots</h1>

      <div className="add-slot-form">
        <h3><FaPlus /> Add New Slot</h3>
        <form onSubmit={handleAdd} className="slot-form">
          <select
            value={newSlot.dayOfWeek}
            onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}
          >
            {days.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <input
            type="time"
            value={newSlot.startTime}
            onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
            required
          />
          <span>to</span>
          <input
            type="time"
            value={newSlot.endTime}
            onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
            required
          />
          <button type="submit" className="btn btn-primary">
            <FaPlus /> Add
          </button>
        </form>
      </div>

      <div className="slots-schedule">
        {days.map((day) => (
          <div key={day} className="day-slots">
            <h4>{day}</h4>
            {slotsByDay[day].length === 0 ? (
              <p className="no-slots-text">No slots</p>
            ) : (
              <div className="slot-tags">
                {slotsByDay[day].map((slot) => (
                  <div key={slot.id} className="slot-tag">
                    <span>{slot.startTime} - {slot.endTime}</span>
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDelete(slot.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSlots;
