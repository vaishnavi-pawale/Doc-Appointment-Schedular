import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorAPI } from '../../api/api';
import { FaSearch, FaUserMd, FaStar, FaMoneyBillWave } from 'react-icons/fa';

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('specialization');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  const fetchAllDoctors = async () => {
    try {
      const response = await doctorAPI.getAll();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchAllDoctors();
      return;
    }
    setLoading(true);
    try {
      let response;
      if (searchType === 'specialization') {
        response = await doctorAPI.searchBySpecialization(searchQuery);
      } else {
        response = await doctorAPI.searchByName(searchQuery);
      }
      setDoctors(response.data);
    } catch (error) {
      console.error('Error searching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-search">
      <h1><FaUserMd /> Find Doctors</h1>

      <form onSubmit={handleSearch} className="search-bar">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="search-select"
        >
          <option value="specialization">Specialization</option>
          <option value="name">Doctor Name</option>
        </select>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search by ${searchType}...`}
          className="search-input"
        />
        <button type="submit" className="btn btn-primary">
          <FaSearch /> Search
        </button>
      </form>

      {loading ? (
        <div className="loading">Loading doctors...</div>
      ) : doctors.length === 0 ? (
        <div className="empty-state">
          <FaUserMd className="empty-icon" />
          <p>No doctors found. Try a different search.</p>
        </div>
      ) : (
        <div className="doctor-grid">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <div className="doctor-avatar">
                <FaUserMd />
              </div>
              <div className="doctor-details">
                <h3>Dr. {doctor.fullName}</h3>
                <p className="specialization">{doctor.specialization}</p>
                <div className="doctor-meta">
                  <span><FaStar /> {doctor.experienceYears} yrs exp</span>
                  {doctor.consultationFee && (
                    <span><FaMoneyBillWave /> ${doctor.consultationFee}</span>
                  )}
                </div>
                {doctor.qualification && (
                  <p className="qualification">{doctor.qualification}</p>
                )}
              </div>
              <Link
                to={`/book-appointment/${doctor.id}`}
                className="btn btn-primary btn-sm"
              >
                Book Appointment
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorSearch;
