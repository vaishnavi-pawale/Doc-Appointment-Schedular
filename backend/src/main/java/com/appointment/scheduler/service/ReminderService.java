package com.appointment.scheduler.service;

import com.appointment.scheduler.entity.Appointment;
import com.appointment.scheduler.entity.AppointmentStatus;
import com.appointment.scheduler.repository.AppointmentRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReminderService {

    private final AppointmentRepository appointmentRepository;
    private final EmailService emailService;

    public ReminderService(AppointmentRepository appointmentRepository, EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.emailService = emailService;
    }

    // Run every day at 8 AM to send reminders for next day's appointments
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendDailyReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Appointment> appointments = appointmentRepository
                .findByAppointmentDateAndStatus(tomorrow, AppointmentStatus.ACCEPTED);

        for (Appointment appointment : appointments) {
            try {
                emailService.sendAppointmentReminder(
                        appointment.getPatient().getUser().getEmail(),
                        appointment.getPatient().getUser().getFullName(),
                        appointment.getDoctor().getUser().getFullName(),
                        appointment.getAppointmentDate().toString(),
                        appointment.getStartTime().toString()
                );
            } catch (Exception e) {
                // Log but continue with other reminders
            }
        }
    }
}
