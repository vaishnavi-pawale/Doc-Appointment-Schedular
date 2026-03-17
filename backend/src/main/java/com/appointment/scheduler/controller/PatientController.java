package com.appointment.scheduler.controller;

import com.appointment.scheduler.dto.*;
import com.appointment.scheduler.service.AppointmentService;
import com.appointment.scheduler.service.PatientService;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
@PreAuthorize("hasRole('PATIENT')")
public class PatientController {

    private final AppointmentService appointmentService;
    private final PatientService patientService;

    public PatientController(AppointmentService appointmentService, PatientService patientService) {
        this.appointmentService = appointmentService;
        this.patientService = patientService;
    }

    @GetMapping("/profile")
    public ResponseEntity<PatientResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(patientService.getPatientByEmail(authentication.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<PatientResponse> updateProfile(Authentication authentication,
                                                          @Valid @RequestBody PatientProfileRequest request) {
        return ResponseEntity.ok(patientService.updateProfile(authentication.getName(), request));
    }

    @PostMapping("/appointments")
    public ResponseEntity<AppointmentResponse> bookAppointment(
            Authentication authentication,
            @Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.bookAppointment(authentication.getName(), request));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getPatientAppointments(authentication.getName()));
    }

    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<AppointmentResponse> cancelAppointment(
            Authentication authentication,
            @PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(authentication.getName(), id));
    }
}
