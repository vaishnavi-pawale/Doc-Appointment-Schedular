package com.appointment.scheduler.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class DoctorResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String specialization;
    private int experienceYears;
    private String qualification;
    private BigDecimal consultationFee;
    private String about;
    private List<TimeSlotResponse> timeSlots;

    @Data
    public static class TimeSlotResponse {
        private Long id;
        private String dayOfWeek;
        private String startTime;
        private String endTime;
        private boolean available;
    }
}
