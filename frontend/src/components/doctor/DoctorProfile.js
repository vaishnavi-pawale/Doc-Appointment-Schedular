import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { doctorAPI } from '../../api/api';
import { FaUserMd, FaSave } from 'react-icons/fa';

const DoctorProfile = () => {
  const [profile, setProfile] = useState({
    specialization: '',
    experienceYears: 0,
    qualification: '',
    consultationFee: '',
    about: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await doctorAPI.getProfile();
      const data = response.data;
      setProfile({
        specialization: data.specialization || '',
        experienceYears: data.experienceYears || 0,
        qualification: data.qualification || '',
        consultationFee: data.consultationFee || '',
        about: data.about || '',
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProfile({
      ...profile,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await doctorAPI.updateProfile(profile);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="doctor-profile">
      <h1><FaUserMd /> My Profile</h1>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Specialization</label>
          <input
            type="text"
            name="specialization"
            value={profile.specialization}
            onChange={handleChange}
            placeholder="e.g., Cardiology, Dermatology"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Experience (Years)</label>
            <input
              type="number"
              name="experienceYears"
              value={profile.experienceYears}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label>Consultation Fee ($)</label>
            <input
              type="number"
              name="consultationFee"
              value={profile.consultationFee}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Qualification</label>
          <input
            type="text"
            name="qualification"
            value={profile.qualification}
            onChange={handleChange}
            placeholder="e.g., MBBS, MD, MS"
          />
        </div>

        <div className="form-group">
          <label>About</label>
          <textarea
            name="about"
            value={profile.about}
            onChange={handleChange}
            placeholder="Tell patients about yourself..."
            rows="4"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          <FaSave /> {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default DoctorProfile;
