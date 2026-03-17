package com.appointment.scheduler.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendAppointmentConfirmation(String toEmail, String patientName,
                                            String doctorName, String date, String time) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Appointment Booking Confirmation");
        message.setText(String.format(
                "Dear %s,\n\n" +
                "Your appointment has been booked successfully!\n\n" +
                "Details:\n" +
                "Doctor: Dr. %s\n" +
                "Date: %s\n" +
                "Time: %s\n\n" +
                "Status: PENDING (Awaiting doctor's confirmation)\n\n" +
                "Thank you for using Doctor Appointment Scheduler.\n\n" +
                "Best regards,\nDoctor Appointment Scheduler Team",
                patientName, doctorName, date, time
        ));
        mailSender.send(message);
    }

    @Async
    public void sendStatusUpdateEmail(String toEmail, String patientName,
                                      String doctorName, String date, String status) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Appointment Status Update");
        message.setText(String.format(
                "Dear %s,\n\n" +
                "Your appointment with Dr. %s on %s has been updated.\n\n" +
                "New Status: %s\n\n" +
                "Thank you for using Doctor Appointment Scheduler.\n\n" +
                "Best regards,\nDoctor Appointment Scheduler Team",
                patientName, doctorName, date, status
        ));
        mailSender.send(message);
    }

    @Async
    public void sendAppointmentReminder(String toEmail, String patientName,
                                        String doctorName, String date, String time) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Appointment Reminder");
        message.setText(String.format(
                "Dear %s,\n\n" +
                "This is a reminder for your upcoming appointment.\n\n" +
                "Doctor: Dr. %s\n" +
                "Date: %s\n" +
                "Time: %s\n\n" +
                "Please arrive 10 minutes before your scheduled time.\n\n" +
                "Best regards,\nDoctor Appointment Scheduler Team",
                patientName, doctorName, date, time
        ));
        mailSender.send(message);
    }
}
