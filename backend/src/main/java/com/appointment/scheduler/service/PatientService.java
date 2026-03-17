package com.appointment.scheduler.service;

import com.appointment.scheduler.dto.PatientProfileRequest;
import com.appointment.scheduler.dto.PatientResponse;
import com.appointment.scheduler.entity.Patient;
import com.appointment.scheduler.entity.User;
import com.appointment.scheduler.exception.ResourceNotFoundException;
import com.appointment.scheduler.repository.PatientRepository;
import com.appointment.scheduler.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientService(PatientRepository patientRepository, UserRepository userRepository) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    public PatientResponse getPatientByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
        return mapToPatientResponse(patient);
    }

    @Transactional
    public PatientResponse updateProfile(String email, PatientProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        if (request.getAge() != null) {
            patient.setAge(request.getAge());
        }
        patient.setGender(request.getGender());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setAddress(request.getAddress());

        patient = patientRepository.save(patient);
        return mapToPatientResponse(patient);
    }

    private PatientResponse mapToPatientResponse(Patient patient) {
        PatientResponse response = new PatientResponse();
        response.setId(patient.getId());
        response.setUserId(patient.getUser().getId());
        response.setFullName(patient.getUser().getFullName());
        response.setEmail(patient.getUser().getEmail());
        response.setPhone(patient.getUser().getPhone());
        response.setAge(patient.getAge());
        response.setGender(patient.getGender());
        response.setBloodGroup(patient.getBloodGroup());
        response.setAddress(patient.getAddress());
        return response;
    }
}
