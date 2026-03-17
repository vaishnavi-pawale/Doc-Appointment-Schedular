package com.appointment.scheduler.dto;

import lombok.Data;

@Data
public class PatientProfileRequest {
    private Integer age;
    private String gender;
    private String bloodGroup;
    private String address;
}
