package com.appointment.scheduler.dto;

import lombok.Data;

@Data
public class AppointmentResponse {
    private Long id;
    private String doctorName;
    private String doctorSpecialization;
    private String patientName;
    private String patientEmail;
    private String appointmentDate;
    private String startTime;
    private String endTime;
    private String status;
    private String reason;
    private String notes;
    private String createdAt;
}
