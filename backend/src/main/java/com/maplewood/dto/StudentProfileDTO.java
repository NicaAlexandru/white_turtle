package com.maplewood.dto;

import com.maplewood.model.Student;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StudentProfileDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Integer gradeLevel;
    private Integer enrollmentYear;
    private Integer expectedGraduationYear;
    private Double gpa;
    private Double creditsEarned;
    private Double creditsRequired;
    private List<CourseHistoryDTO> courseHistory;

    public static StudentProfileDTO fromEntity(Student student, double gpa, double creditsEarned,
                                                List<CourseHistoryDTO> courseHistory) {
        return StudentProfileDTO.builder()
                .id(student.getId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .gradeLevel(student.getGradeLevel())
                .enrollmentYear(student.getEnrollmentYear())
                .expectedGraduationYear(student.getExpectedGraduationYear())
                .gpa(gpa)
                .creditsEarned(creditsEarned)
                .creditsRequired(30.0)
                .courseHistory(courseHistory)
                .build();
    }
}
