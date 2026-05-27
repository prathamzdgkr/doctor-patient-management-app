package com.example.doctorpatientapp.controller;

import com.example.doctorpatientapp.entity.Patient;
import com.example.doctorpatientapp.repository.PatientRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientRepository patientRepository;

    public PatientController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @PostMapping
    public Patient addPatient(@RequestBody Patient patient) {
        return patientRepository.save(patient);
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @GetMapping("/{id}")
    public Patient getPatientById(@PathVariable Long id) {
        return patientRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Patient updatePatient(@PathVariable Long id, @RequestBody Patient patient) {

        Patient existingPatient = patientRepository.findById(id).orElse(null);

        if (existingPatient != null) {

            existingPatient.setPatientName(patient.getPatientName());
            existingPatient.setAge(patient.getAge());
            existingPatient.setDisease(patient.getDisease());

            return patientRepository.save(existingPatient);
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public String deletePatient(@PathVariable Long id) {

        patientRepository.deleteById(id);

        return "Patient Deleted Successfully";
    }
}