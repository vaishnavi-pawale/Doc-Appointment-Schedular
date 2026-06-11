package com.appointment.scheduler.repository;

import com.appointment.scheduler.entity.Doctor;
import com.appointment.scheduler.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    @EntityGraph(attributePaths = {"user", "timeSlots"})
    List<Doctor> findAll();

    @EntityGraph(attributePaths = {"user", "timeSlots"})
    Optional<Doctor> findById(Long id);

    @EntityGraph(attributePaths = {"user", "timeSlots"})
    Optional<Doctor> findByUser(User user);

    @EntityGraph(attributePaths = {"user", "timeSlots"})
    Optional<Doctor> findByUserId(Long userId);

    @EntityGraph(attributePaths = {"user", "timeSlots"})
    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);

    @EntityGraph(attributePaths = {"user", "timeSlots"})
    List<Doctor> findByUserFullNameContainingIgnoreCase(String name);
}
