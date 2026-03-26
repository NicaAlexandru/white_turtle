package com.maplewood.service;

import com.maplewood.dto.EnrollmentRequestDTO;
import com.maplewood.dto.EnrollmentResponseDTO;
import com.maplewood.dto.ScheduleEntryDTO;
import com.maplewood.enums.EnrollmentStatus;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.model.CourseSection;
import com.maplewood.model.Enrollment;
import com.maplewood.model.Student;
import com.maplewood.repository.CourseSectionRepository;
import com.maplewood.repository.EnrollmentRepository;
import com.maplewood.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseSectionRepository courseSectionRepository;
    private final StudentRepository studentRepository;
    private final ValidationService validationService;

    @Transactional
    public EnrollmentResponseDTO enroll(EnrollmentRequestDTO request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));
        CourseSection section = courseSectionRepository.findById(request.getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + request.getSectionId()));

        validationService.validateEnrollment(student, section);

        // Re-activate a previously dropped enrollment if one exists, otherwise create new
        Enrollment enrollment = enrollmentRepository
                .findByStudentIdAndSectionId(student.getId(), section.getId())
                .orElseGet(() -> {
                    Enrollment e = new Enrollment();
                    e.setStudent(student);
                    e.setSection(section);
                    return e;
                });
        enrollment.setStatus(EnrollmentStatus.enrolled);
        enrollment = enrollmentRepository.save(enrollment);

        log.info("Student {} enrolled in {} section {}", student.getFullName(),
                section.getCourse().getCode(), section.getSectionNumber());

        return EnrollmentResponseDTO.builder()
                .enrollmentId(enrollment.getId())
                .message("Successfully enrolled in " + section.getCourse().getName())
                .scheduleEntry(ScheduleEntryDTO.fromEnrollment(enrollment)).build();
    }

    @Transactional
    public void dropEnrollment(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));
        enrollment.setStatus(EnrollmentStatus.dropped);
        enrollmentRepository.save(enrollment);
        log.info("Enrollment {} dropped", enrollmentId);
    }
}
