package com.maplewood.service;

import com.maplewood.TestUtils;
import com.maplewood.dto.StudentProfileDTO;
import com.maplewood.enums.CourseStatus;
import com.maplewood.enums.CourseType;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.model.*;
import com.maplewood.repository.StudentCourseHistoryRepository;
import com.maplewood.repository.StudentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock private StudentRepository studentRepository;
    @Mock private StudentCourseHistoryRepository historyRepository;

    @InjectMocks
    private StudentService studentService;

    @Test
    @DisplayName("Returns student profile with course history and computed GPA")
    void getStudentProfileSuccess() {
        Student student = TestUtils.student(1L, "Alice", "Smith", 10);
        Course eng = TestUtils.course(10L, "ENG101", "English I", 9, 12, CourseType.core);
        Course mat = TestUtils.course(11L, "MAT101", "Algebra I", 9, 12, CourseType.core);

        StudentCourseHistory passedEng = TestUtils.history(1L, student, eng, CourseStatus.passed);
        StudentCourseHistory failedMat = TestUtils.history(2L, student, mat, CourseStatus.failed);

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(historyRepository.findByStudentIdWithDetails(1L))
                .thenReturn(List.of(passedEng, failedMat));

        StudentProfileDTO profile = studentService.getStudentProfile(1L);

        assertThat(profile.getId()).isEqualTo(1L);
        assertThat(profile.getFirstName()).isEqualTo("Alice");
        assertThat(profile.getCourseHistory()).hasSize(2);
        // GPA = (3 passed / 6 attempted) * 4.0 = 2.0
        assertThat(profile.getGpa()).isEqualTo(2.0);
        assertThat(profile.getCreditsEarned()).isEqualTo(3.0);
        assertThat(profile.getCreditsRequired()).isEqualTo(30.0);
    }

    @Test
    @DisplayName("Returns 4.0 GPA when all courses passed")
    void perfectGpa() {
        Student student = TestUtils.student();
        Course c1 = TestUtils.course(10L, "ENG101", "English I", 9, 12, CourseType.core);
        Course c2 = TestUtils.course(11L, "MAT101", "Algebra I", 9, 12, CourseType.core);

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(historyRepository.findByStudentIdWithDetails(1L))
                .thenReturn(List.of(
                        TestUtils.history(1L, student, c1, CourseStatus.passed),
                        TestUtils.history(2L, student, c2, CourseStatus.passed)
                ));

        StudentProfileDTO profile = studentService.getStudentProfile(1L);

        assertThat(profile.getGpa()).isEqualTo(4.0);
        assertThat(profile.getCreditsEarned()).isEqualTo(6.0);
    }

    @Test
    @DisplayName("Returns 0.0 GPA when all courses failed")
    void zeroGpa() {
        Student student = TestUtils.student();
        Course c1 = TestUtils.course(10L, "ENG101", "English I", 9, 12, CourseType.core);

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(historyRepository.findByStudentIdWithDetails(1L))
                .thenReturn(List.of(
                        TestUtils.history(1L, student, c1, CourseStatus.failed)
                ));

        StudentProfileDTO profile = studentService.getStudentProfile(1L);

        assertThat(profile.getGpa()).isEqualTo(0.0);
        assertThat(profile.getCreditsEarned()).isEqualTo(0.0);
    }

    @Test
    @DisplayName("Returns 0.0 GPA with empty history")
    void emptyHistory() {
        Student student = TestUtils.student();

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(historyRepository.findByStudentIdWithDetails(1L))
                .thenReturn(Collections.emptyList());

        StudentProfileDTO profile = studentService.getStudentProfile(1L);

        assertThat(profile.getGpa()).isEqualTo(0.0);
        assertThat(profile.getCreditsEarned()).isEqualTo(0.0);
        assertThat(profile.getCourseHistory()).isEmpty();
    }

    @Test
    @DisplayName("Throws ResourceNotFoundException when student not found")
    void studentNotFound() {
        when(studentRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.getStudentProfile(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Student not found");
    }
}
