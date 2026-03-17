package com.maplewood.service;

import com.maplewood.dto.CourseHistoryDTO;
import com.maplewood.dto.StudentProfileDTO;
import com.maplewood.enums.CourseStatus;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.model.Student;
import com.maplewood.model.StudentCourseHistory;
import com.maplewood.repository.StudentCourseHistoryRepository;
import com.maplewood.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentCourseHistoryRepository historyRepository;

    public StudentProfileDTO getStudentProfile(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        List<StudentCourseHistory> history = historyRepository.findByStudentIdWithDetails(studentId);
        List<CourseHistoryDTO> courseHistory = history.stream().map(CourseHistoryDTO::fromEntity).toList();
        double creditsEarned = calculateCreditsEarned(history);
        double gpa = calculateGpa(history);

        return StudentProfileDTO.fromEntity(student, gpa, creditsEarned, courseHistory);
    }

    /** GPA = (credits passed / total credits attempted) * 4.0 */
    private double calculateGpa(List<StudentCourseHistory> history) {
        if (history.isEmpty()) {
            return 0.0;
        }

        double totalCreditsAttempted = 0, creditsPassed = 0;
        for (StudentCourseHistory record : history) {
            double credits = record.getCourse().getCredits();
            totalCreditsAttempted += credits;

            if (CourseStatus.passed == record.getStatus()) {
                creditsPassed += credits;
            }
        }

        if (totalCreditsAttempted == 0) return 0.0;
        return Math.round((creditsPassed / totalCreditsAttempted) * 400.0) / 100.0;
    }

    private double calculateCreditsEarned(List<StudentCourseHistory> history) {
        return history.stream()
            .filter(h -> CourseStatus.passed == h.getStatus())
            .mapToDouble(h -> h.getCourse().getCredits())
            .sum();
    }
}
