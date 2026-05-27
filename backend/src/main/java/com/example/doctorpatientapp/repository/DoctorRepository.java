package com.example.doctorpatientapp.repository;

import com.example.doctorpatientapp.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor,Long> {
}
