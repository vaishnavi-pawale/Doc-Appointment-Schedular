package com.appointment.scheduler.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DoctorProfileRequest {
    @NotBlank(message = "Specialization is required")
    private String specialization;

    @NotNull(message = "Experience years is required")
    private Integer experienceYears;

    private String qualification;

    @NotNull(message = "Consultation fee is required")
    private BigDecimal consultationFee;

    private String about;
}
