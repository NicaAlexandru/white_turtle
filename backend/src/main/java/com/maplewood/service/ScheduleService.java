package com.maplewood.service;

import com.maplewood.dto.ScheduleDTO;
import com.maplewood.dto.ScheduleEntryDTO;
import com.maplewood.enums.EnrollmentStatus;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.model.Semester;
import com.maplewood.model.Student;
import com.maplewood.repository.EnrollmentRepository;
import com.maplewood.repository.SemesterRepository;
import com.maplewood.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final SemesterRepository semesterRepository;

    public ScheduleDTO getStudentSchedule(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        Semester activeSemester = semesterRepository.findByIsActiveTrue()
                .orElseThrow(() -> new ResourceNotFoundException("No active semester found"));

        List<ScheduleEntryDTO> entries = enrollmentRepository
                .findByStudentIdAndStatusAndSectionSemesterIsActiveTrue(studentId, EnrollmentStatus.enrolled)
                .stream().map(ScheduleEntryDTO::fromEnrollment).toList();

        return ScheduleDTO.builder().studentId(student.getId()).studentName(student.getFullName())
                .semesterName(activeSemester.getDisplayName())
                .courseCount(entries.size()).entries(entries).build();
    }
}
