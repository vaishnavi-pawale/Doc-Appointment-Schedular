package com.appointment.scheduler.service;

import com.appointment.scheduler.dto.*;
import com.appointment.scheduler.entity.*;
import com.appointment.scheduler.exception.ResourceNotFoundException;
import com.appointment.scheduler.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final TimeSlotRepository timeSlotRepository;

    public DoctorService(DoctorRepository doctorRepository,
                        UserRepository userRepository,
                        TimeSlotRepository timeSlotRepository) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.timeSlotRepository = timeSlotRepository;
    }

        @Transactional(readOnly = true)
    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::mapToDoctorResponse)
                .collect(Collectors.toList());
    }

        @Transactional(readOnly = true)
    public DoctorResponse getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return mapToDoctorResponse(doctor);
    }

        @Transactional(readOnly = true)
    public DoctorResponse getDoctorByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
        return mapToDoctorResponse(doctor);
    }

        @Transactional(readOnly = true)
    public List<DoctorResponse> searchDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationContainingIgnoreCase(specialization).stream()
                .map(this::mapToDoctorResponse)
                .collect(Collectors.toList());
    }

        @Transactional(readOnly = true)
    public List<DoctorResponse> searchDoctorsByName(String name) {
        return doctorRepository.findByUserFullNameContainingIgnoreCase(name).stream()
                .map(this::mapToDoctorResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DoctorResponse updateProfile(String email, DoctorProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));

        doctor.setSpecialization(request.getSpecialization());
        doctor.setExperienceYears(request.getExperienceYears());
        doctor.setQualification(request.getQualification());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setAbout(request.getAbout());

        doctor = doctorRepository.save(doctor);
        return mapToDoctorResponse(doctor);
    }

    @Transactional
    public DoctorResponse addTimeSlot(String email, TimeSlotRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));

        TimeSlot timeSlot = TimeSlot.builder()
                .doctor(doctor)
                .dayOfWeek(request.getDayOfWeek())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .available(true)
                .build();

        timeSlotRepository.save(timeSlot);
        return mapToDoctorResponse(doctorRepository.findById(doctor.getId()).get());
    }

    @Transactional
    public ApiResponse deleteTimeSlot(String email, Long slotId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));

        TimeSlot slot = timeSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Time slot not found"));

        if (!slot.getDoctor().getId().equals(doctor.getId())) {
            throw new IllegalArgumentException("You can only delete your own time slots");
        }

        timeSlotRepository.delete(slot);
        return new ApiResponse(true, "Time slot deleted successfully");
    }

    private DoctorResponse mapToDoctorResponse(Doctor doctor) {
        DoctorResponse response = new DoctorResponse();
        response.setId(doctor.getId());
        response.setUserId(doctor.getUser().getId());
        response.setFullName(doctor.getUser().getFullName());
        response.setEmail(doctor.getUser().getEmail());
        response.setPhone(doctor.getUser().getPhone());
        response.setSpecialization(doctor.getSpecialization());
        response.setExperienceYears(doctor.getExperienceYears());
        response.setQualification(doctor.getQualification());
        response.setConsultationFee(doctor.getConsultationFee());
        response.setAbout(doctor.getAbout());

        List<DoctorResponse.TimeSlotResponse> slots = doctor.getTimeSlots().stream()
                .map(slot -> {
                    DoctorResponse.TimeSlotResponse slotResponse = new DoctorResponse.TimeSlotResponse();
                    slotResponse.setId(slot.getId());
                    slotResponse.setDayOfWeek(slot.getDayOfWeek().name());
                    slotResponse.setStartTime(slot.getStartTime().toString());
                    slotResponse.setEndTime(slot.getEndTime().toString());
                    slotResponse.setAvailable(slot.isAvailable());
                    return slotResponse;
                })
                .collect(Collectors.toList());
        response.setTimeSlots(slots);

        return response;
    }
}
