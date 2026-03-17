package com.appointment.scheduler.controller;

import com.appointment.scheduler.dto.*;
import com.appointment.scheduler.service.AppointmentService;
import com.appointment.scheduler.service.DoctorService;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    private final DoctorService doctorService;
    private final AppointmentService appointmentService;

    public DoctorController(DoctorService doctorService, AppointmentService appointmentService) {
        this.doctorService = doctorService;
        this.appointmentService = appointmentService;
    }

    // Public endpoints for searching doctors
    @GetMapping("/all")
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponse> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping("/search/specialization")
    public ResponseEntity<List<DoctorResponse>> searchBySpecialization(@RequestParam String query) {
        return ResponseEntity.ok(doctorService.searchDoctorsBySpecialization(query));
    }

    @GetMapping("/search/name")
    public ResponseEntity<List<DoctorResponse>> searchByName(@RequestParam String query) {
        return ResponseEntity.ok(doctorService.searchDoctorsByName(query));
    }

    // Protected doctor endpoints
    @GetMapping("/profile")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(doctorService.getDoctorByEmail(authentication.getName()));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorResponse> updateProfile(Authentication authentication,
                                                         @Valid @RequestBody DoctorProfileRequest request) {
        return ResponseEntity.ok(doctorService.updateProfile(authentication.getName(), request));
    }

    @PostMapping("/slots")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorResponse> addTimeSlot(Authentication authentication,
                                                       @Valid @RequestBody TimeSlotRequest request) {
        return ResponseEntity.ok(doctorService.addTimeSlot(authentication.getName(), request));
    }

    @DeleteMapping("/slots/{slotId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse> deleteTimeSlot(Authentication authentication,
                                                       @PathVariable Long slotId) {
        return ResponseEntity.ok(doctorService.deleteTimeSlot(authentication.getName(), slotId));
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<AppointmentResponse>> getAppointments(Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getDoctorAppointments(authentication.getName()));
    }

    @PutMapping("/appointments/{id}/status")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(authentication.getName(), id, status));
    }

    @PutMapping("/appointments/{id}/notes")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<AppointmentResponse> addNotes(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody String notes) {
        return ResponseEntity.ok(appointmentService.addNotes(authentication.getName(), id, notes));
    }
}
