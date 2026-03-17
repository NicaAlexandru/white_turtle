package com.maplewood.service;

import com.maplewood.TestUtils;
import com.maplewood.dto.ScheduleDTO;
import com.maplewood.enums.EnrollmentStatus;
import com.maplewood.enums.CourseType;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.model.*;
import com.maplewood.repository.EnrollmentRepository;
import com.maplewood.repository.SemesterRepository;
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
class ScheduleServiceTest {

    @Mock private EnrollmentRepository enrollmentRepository;
    @Mock private StudentRepository studentRepository;
    @Mock private SemesterRepository semesterRepository;

    @InjectMocks
    private ScheduleService scheduleService;

    @Test
    @DisplayName("Returns schedule with enrolled entries for active semester")
    void getScheduleSuccess() {
        Student student = TestUtils.student();
        Semester semester = TestUtils.activeSemester();
        Course course = TestUtils.course();
        CourseSection section = TestUtils.section();
        Enrollment enrollment = TestUtils.enrollment(200L, student, section);

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(semesterRepository.findByIsActiveTrue()).thenReturn(Optional.of(semester));
        when(enrollmentRepository.findByStudentIdAndStatusAndSectionSemesterIsActiveTrue(
                1L, EnrollmentStatus.enrolled))
                .thenReturn(List.of(enrollment));

        ScheduleDTO schedule = scheduleService.getStudentSchedule(1L);

        assertThat(schedule.getStudentId()).isEqualTo(1L);
        assertThat(schedule.getStudentName()).isEqualTo("Alice Smith");
        assertThat(schedule.getSemesterName()).isEqualTo("Fall 2024");
        assertThat(schedule.getCourseCount()).isEqualTo(1);
        assertThat(schedule.getEntries()).hasSize(1);
        assertThat(schedule.getEntries().get(0).getCourseCode()).isEqualTo("ENG101");
    }

    @Test
    @DisplayName("Returns empty entries when no enrollments")
    void emptySchedule() {
        Student student = TestUtils.student();
        Semester semester = TestUtils.activeSemester();

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(semesterRepository.findByIsActiveTrue()).thenReturn(Optional.of(semester));
        when(enrollmentRepository.findByStudentIdAndStatusAndSectionSemesterIsActiveTrue(
                1L, EnrollmentStatus.enrolled))
                .thenReturn(Collections.emptyList());

        ScheduleDTO schedule = scheduleService.getStudentSchedule(1L);

        assertThat(schedule.getCourseCount()).isZero();
        assertThat(schedule.getEntries()).isEmpty();
    }

    @Test
    @DisplayName("Throws when student not found")
    void studentNotFound() {
        when(studentRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> scheduleService.getStudentSchedule(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Student not found");
    }

    @Test
    @DisplayName("Throws when no active semester")
    void noActiveSemester() {
        Student student = TestUtils.student();
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(semesterRepository.findByIsActiveTrue()).thenReturn(Optional.empty());

        assertThatThrownBy(() -> scheduleService.getStudentSchedule(1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("No active semester");
    }
}
