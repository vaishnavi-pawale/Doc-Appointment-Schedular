package com.appointment.scheduler.service;

import com.appointment.scheduler.dto.*;
import com.appointment.scheduler.entity.*;
import com.appointment.scheduler.exception.ResourceNotFoundException;
import com.appointment.scheduler.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public AppointmentService(AppointmentRepository appointmentRepository,
                             DoctorRepository doctorRepository,
                             PatientRepository patientRepository,
                             UserRepository userRepository,
                             EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Transactional
    public AppointmentResponse bookAppointment(String patientEmail, AppointmentRequest request) {
        User patientUser = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Patient patient = patientRepository.findByUser(patientUser)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        // Check if appointment date is in the future
        if (request.getAppointmentDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Appointment date must be in the future");
        }

        // Check for conflicting appointments
        List<Appointment> existingAppointments = appointmentRepository
                .findByDoctorIdAndAppointmentDate(doctor.getId(), request.getAppointmentDate());

        boolean hasConflict = existingAppointments.stream()
                .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED && a.getStatus() != AppointmentStatus.REJECTED)
                .anyMatch(a -> request.getStartTime().isBefore(a.getEndTime())
                        && request.getEndTime().isAfter(a.getStartTime()));

        if (hasConflict) {
            throw new IllegalArgumentException("This time slot is already booked");
        }

        Appointment appointment = Appointment.builder()
                .doctor(doctor)
                .patient(patient)
                .appointmentDate(request.getAppointmentDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .reason(request.getReason())
                .status(AppointmentStatus.PENDING)
                .build();

        appointment = appointmentRepository.save(appointment);

        // Send email notification
        try {
            emailService.sendAppointmentConfirmation(
                    patientUser.getEmail(),
                    patientUser.getFullName(),
                    doctor.getUser().getFullName(),
                    appointment.getAppointmentDate().toString(),
                    appointment.getStartTime().toString()
            );
        } catch (Exception e) {
            // Log but don't fail the booking if email fails
        }

        return mapToResponse(appointment);
    }

    public List<AppointmentResponse> getDoctorAppointments(String doctorEmail) {
        User user = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));

        return appointmentRepository.findByDoctorId(doctor.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getPatientAppointments(String patientEmail) {
        User user = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        return appointmentRepository.findByPatientId(patient.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentResponse updateAppointmentStatus(String doctorEmail, Long appointmentId, String status) {
        User user = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new IllegalArgumentException("You can only update your own appointments");
        }

        AppointmentStatus newStatus;
        try {
            newStatus = AppointmentStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }

        appointment.setStatus(newStatus);
        appointment = appointmentRepository.save(appointment);

        // Send status update email
        try {
            emailService.sendStatusUpdateEmail(
                    appointment.getPatient().getUser().getEmail(),
                    appointment.getPatient().getUser().getFullName(),
                    doctor.getUser().getFullName(),
                    appointment.getAppointmentDate().toString(),
                    newStatus.name()
            );
        } catch (Exception e) {
            // Log but don't fail
        }

        return mapToResponse(appointment);
    }

    @Transactional
    public AppointmentResponse cancelAppointment(String patientEmail, Long appointmentId) {
        User user = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getPatient().getId().equals(patient.getId())) {
            throw new IllegalArgumentException("You can only cancel your own appointments");
        }

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new IllegalArgumentException("Cannot cancel a completed appointment");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment = appointmentRepository.save(appointment);

        return mapToResponse(appointment);
    }

    @Transactional
    public AppointmentResponse addNotes(String doctorEmail, Long appointmentId, String notes) {
        User user = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new IllegalArgumentException("You can only add notes to your own appointments");
        }

        appointment.setNotes(notes);
        appointment = appointmentRepository.save(appointment);

        return mapToResponse(appointment);
    }

    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        AppointmentResponse response = new AppointmentResponse();
        response.setId(appointment.getId());
        response.setDoctorName(appointment.getDoctor().getUser().getFullName());
        response.setDoctorSpecialization(appointment.getDoctor().getSpecialization());
        response.setPatientName(appointment.getPatient().getUser().getFullName());
        response.setPatientEmail(appointment.getPatient().getUser().getEmail());
        response.setAppointmentDate(appointment.getAppointmentDate().toString());
        response.setStartTime(appointment.getStartTime().toString());
        response.setEndTime(appointment.getEndTime().toString());
        response.setStatus(appointment.getStatus().name());
        response.setReason(appointment.getReason());
        response.setNotes(appointment.getNotes());
        response.setCreatedAt(appointment.getCreatedAt() != null ? appointment.getCreatedAt().toString() : null);
        return response;
    }
}
