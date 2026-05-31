import axios from 'axios';

// To your actual live backend service URL:
const BASE_URL = "https://doc-appointment-schedular.onrender.com";

//const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
};

// Doctor APIs
export const doctorAPI = {
  getAll: () => api.get('/doctor/all'),
  getById: (id) => api.get(`/doctor/${id}`),
  searchBySpecialization: (query) => api.get(`/doctor/search/specialization?query=${encodeURIComponent(query)}`),
  searchByName: (query) => api.get(`/doctor/search/name?query=${encodeURIComponent(query)}`),
  getProfile: () => api.get('/doctor/profile'),
  updateProfile: (data) => api.put('/doctor/profile', data),
  addTimeSlot: (data) => api.post('/doctor/slots', data),
  deleteTimeSlot: (id) => api.delete(`/doctor/slots/${id}`),
  getAppointments: () => api.get('/doctor/appointments'),
  updateAppointmentStatus: (id, status) => api.put(`/doctor/appointments/${id}/status?status=${encodeURIComponent(status)}`),
  addNotes: (id, notes) => api.put(`/doctor/appointments/${id}/notes`, notes),
};

// Patient APIs
export const patientAPI = {
  getProfile: () => api.get('/patient/profile'),
  updateProfile: (data) => api.put('/patient/profile', data),
  bookAppointment: (data) => api.post('/patient/appointments', data),
  getAppointments: () => api.get('/patient/appointments'),
  cancelAppointment: (id) => api.put(`/patient/appointments/${id}/cancel`),
};

// Admin APIs
export const adminAPI = {
  getAllDoctors: () => api.get('/admin/doctors'),
  getAllAppointments: () => api.get('/admin/appointments'),
};

export default api;
