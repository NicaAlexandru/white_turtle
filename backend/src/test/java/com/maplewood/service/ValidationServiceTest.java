package com.maplewood.service;

import com.maplewood.TestUtils;
import com.maplewood.enums.CourseType;
import com.maplewood.enums.EnrollmentStatus;
import com.maplewood.enums.ValidationErrorType;
import com.maplewood.exception.EnrollmentValidationException;
import com.maplewood.model.*;
import com.maplewood.repository.EnrollmentRepository;
import com.maplewood.repository.StudentCourseHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ValidationServiceTest {

    @Mock private EnrollmentRepository enrollmentRepository;
    @Mock private StudentCourseHistoryRepository historyRepository;
    @InjectMocks private ValidationService validationService;

    private Student student;
    private Course course;
    private CourseSection section;
    private TimeSlot timeSlot;

    @BeforeEach
    void setUp() {
        student = TestUtils.student(1L, "Alice", "Smith", 10);
        course = TestUtils.course(10L, "ENG101", "English I", 9, 12, CourseType.core);
        timeSlot = TestUtils.timeSlot(1L, "MWF", "08:00", "09:00");
        section = TestUtils.section(100L, course, timeSlot);
    }

    /** Stubs all repository calls to pass — lenient so early failures don't trigger unused stub errors. */
    private void stubAllChecksPass() {
        lenient().when(enrollmentRepository.isAlreadyEnrolledInCourse(anyLong(), anyLong())).thenReturn(false);
        lenient().when(historyRepository.hasPassedCourse(anyLong(), anyLong())).thenReturn(false);
        lenient().when(enrollmentRepository.countActiveByStudentId(anyLong())).thenReturn(0L);
        lenient().when(enrollmentRepository.findByStudentIdAndStatusAndSectionSemesterIsActiveTrue(
                anyLong(), eq(EnrollmentStatus.enrolled))).thenReturn(Collections.emptyList());
        lenient().when(enrollmentRepository.countBySectionId(anyLong())).thenReturn(0L);
    }

    @Nested
    @DisplayName("Happy path")
    class HappyPath {

        @Test
        @DisplayName("Validation passes when all rules are satisfied")
        void allRulesPass() {
            stubAllChecksPass();
            assertThatCode(() -> validationService.validateEnrollment(student, section))
                    .doesNotThrowAnyException();
        }
    }

    @Nested
    @DisplayName("Duplicate enrollment check")
    class DuplicateEnrollment {

        @Test
        @DisplayName("Rejects if already enrolled in same course")
        void alreadyEnrolled() {
            when(enrollmentRepository.isAlreadyEnrolledInCourse(1L, 10L)).thenReturn(true);

            assertThatThrownBy(() -> validationService.validateEnrollment(student, section))
                    .isInstanceOf(EnrollmentValidationException.class)
                    .satisfies(ex -> {
                        var e = (EnrollmentValidationException) ex;
                        assertThat(e.getType()).isEqualTo(ValidationErrorType.duplicate);
                        assertThat(e.getMessage()).contains("Already enrolled");
                    });
        }

        @Test
        @DisplayName("Rejects if already passed the course")
        void alreadyPassed() {
            when(enrollmentRepository.isAlreadyEnrolledInCourse(anyLong(), anyLong())).thenReturn(false);
            when(historyRepository.hasPassedCourse(1L, 10L)).thenReturn(true);

            assertThatThrownBy(() -> validationService.validateEnrollment(student, section))
                    .isInstanceOf(EnrollmentValidationException.class)
                    .satisfies(ex -> {
                        var e = (EnrollmentValidationException) ex;
                        assertThat(e.getType()).isEqualTo(ValidationErrorType.duplicate);
                        assertThat(e.getMessage()).contains("Already passed");
                    });
        }
    }

    @Nested
    @DisplayName("Grade level check")
    class GradeLevel {

        @Test
        @DisplayName("Rejects if student grade is below course minimum")
        void gradeTooLow() {
            course.setGradeLevelMin(11);
            course.setGradeLevelMax(12);
            stubAllChecksPass();

            assertThatThrownBy(() -> validationService.validateEnrollment(student, section))
                    .isInstanceOf(EnrollmentValidationException.class)
                    .satisfies(ex -> {
                        var e = (EnrollmentValidationException) ex;
                        assertThat(e.getType()).isEqualTo(ValidationErrorType.grade_level);
                        assertThat(e.getMessage()).contains("grade 10");
                    });
        }

        @Test
        @DisplayName("Rejects if student grade is above course maximum")
        void gradeTooHigh() {
            student.setGradeLevel(12);
            course.setGradeLevelMin(9);
            course.setGradeLevelMax(10);
            stubAllChecksPass();

            assertThatThrownBy(() -> validationService.validateEnrollment(student, section))
                    .isInstanceOf(EnrollmentValidationException.class)
                    .satisfies(ex -> assertThat(((EnrollmentValidationException) ex).getType())
                            .isEqualTo(ValidationErrorType.grade_level));
        }
    }

    @Nested
    @DisplayName("Prerequisite check")
    class Prerequisite {

        @Test
        @DisplayName("Rejects if prerequisite not passed")
        void prerequisiteNotPassed() {
            Course prereq = TestUtils.course(5L, "ENG100", "Intro English", 9, 12, CourseType.core);
            course.setPrerequisite(prereq);
            stubAllChecksPass();
            when(historyRepository.hasPassedCourse(1L, 5L)).thenReturn(false);

            assertThatThrownBy(() -> validationService.validateEnrollment(student, section))
                    .isInstanceOf(EnrollmentValidationException.class)
                    .satisfies(ex -> {
                        var e = (EnrollmentValidationException) ex;
                        assertThat(e.getType()).isEqualTo(ValidationErrorType.prerequisite);
                        assertThat(e.getMessage()).contains("Missing prerequisite", "ENG100");
                    });
        }

        @Test
        @DisplayName("Passes if prerequisite has been passed")
        void prerequisitePassed() {
            Course prereq = TestUtils.course(5L, "ENG100", "Intro English", 9, 12, CourseType.core);
            course.setPrerequisite(prereq);
            stubAllChecksPass();
            when(historyRepository.hasPassedCourse(1L, 5L)).thenReturn(true);

            assertThatCode(() -> validationService.validateEnrollment(student, section))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("Passes if course has no prerequisite")
        void noPrerequisite() {
            course.setPrerequisite(null);
            stubAllChecksPass();

            assertThatCode(() -> validationService.validateEnrollment(student, section))
                    .doesNotThrowAnyException();
        }
    }

    @Nested
    @DisplayName("Max courses per semester check")
    class MaxCourses {

        @Test
        @DisplayName("Rejects at 5 enrolled courses")
        void maxCoursesReached() {
            stubAllChecksPass();
            when(enrollmentRepository.countActiveByStudentId(1L)).thenReturn(5L);

            assertThatThrownBy(() -> validationService.validateEnrollment(student, section))
                    .isInstanceOf(EnrollmentValidationException.class)
                    .satisfies(ex -> {
                        var e = (EnrollmentValidationException) ex;
                        assertThat(e.getType()).isEqualTo(ValidationErrorType.max_courses);
                        assertThat(e.getMessage()).contains("Maximum of 5");
                    });
        }

        @Test
        @DisplayName("Passes at 4 enrolled courses")
        void underLimit() {
            stubAllChecksPass();
            when(enrollmentRepository.countActiveByStudentId(1L)).thenReturn(4L);

            assertThatCode(() -> validationService.validateEnrollment(student, section))
                    .doesNotThrowAnyException();
        }
    }

    @Nested
    @DisplayName("Time conflict check")
    class TimeConflict {

        @Test
        @DisplayName("Rejects on overlapping time slot")
        void timeConflict() {
            stubAllChecksPass();

            TimeSlot existingSlot = TestUtils.timeSlot(2L, "MWF", "08:30", "09:30");
            Course existingCourse = TestUtils.course(20L, "MAT101", "Algebra I", 9, 12, CourseType.core);
            CourseSection existingSection = TestUtils.section(101L, existingCourse, existingSlot);
            Enrollment existingEnrollment = TestUtils.enrollment(200L, student, existingSection);

            when(enrollmentRepository.findByStudentIdAndStatusAndSectionSemesterIsActiveTrue(
                    1L, EnrollmentStatus.enrolled))
                    .thenReturn(List.of(existingEnrollment));

            assertThatThrownBy(() -> validationService.validateEnrollment(student, section))
                    .isInstanceOf(EnrollmentValidationException.class)
                    .satisfies(ex -> {
                        var e = (EnrollmentValidationException) ex;
                        assertThat(e.getType()).isEqualTo(ValidationErrorType.conflict);
                        assertThat(e.getMessage()).contains("Time conflict");
                    });
        }

        @Test
        @DisplayName("No conflict on different days")
        void differentDays() {
            stubAllChecksPass();

            TimeSlot existingSlot = TestUtils.timeSlot(2L, "TTh", "08:00", "09:00");
            CourseSection existingSection = TestUtils.section(101L,
                    TestUtils.course(20L, "MAT101", "Algebra I", 9, 12, CourseType.core), existingSlot);

            when(enrollmentRepository.findByStudentIdAndStatusAndSectionSemesterIsActiveTrue(
                    1L, EnrollmentStatus.enrolled))
                    .thenReturn(List.of(TestUtils.enrollment(200L, student, existingSection)));

            assertThatCode(() -> validationService.validateEnrollment(student, section))
                    .doesNotThrowAnyException();
        }

        @Test
        @DisplayName("No conflict on same days but non-overlapping times")
        void sameDaysDifferentTimes() {
            stubAllChecksPass();

            TimeSlot existingSlot = TestUtils.timeSlot(2L, "MWF", "09:00", "10:00");
            CourseSection existingSection = TestUtils.section(101L,
                    TestUtils.course(20L, "MAT101", "Algebra I", 9, 12, CourseType.core), existingSlot);

            when(enrollmentRepository.findByStudentIdAndStatusAndSectionSemesterIsActiveTrue(
                    1L, EnrollmentStatus.enrolled))
                    .thenReturn(List.of(TestUtils.enrollment(200L, student, existingSection)));

            assertThatCode(() -> validationService.validateEnrollment(student, section))
                    .doesNotThrowAnyException();
        }
    }

    @Nested
    @DisplayName("Capacity check")
    class Capacity {

        @Test
        @DisplayName("Rejects when section is full")
        void sectionFull() {
            stubAllChecksPass();
            section.setMaxCapacity(10);
            when(enrollmentRepository.countBySectionId(100L)).thenReturn(10L);

            assertThatThrownBy(() -> validationService.validateEnrollment(student, section))
                    .isInstanceOf(EnrollmentValidationException.class)
                    .satisfies(ex -> {
                        var e = (EnrollmentValidationException) ex;
                        assertThat(e.getType()).isEqualTo(ValidationErrorType.capacity);
                        assertThat(e.getMessage()).contains("full");
                    });
        }

        @Test
        @DisplayName("Passes when seats available")
        void seatsAvailable() {
            stubAllChecksPass();
            section.setMaxCapacity(10);
            when(enrollmentRepository.countBySectionId(100L)).thenReturn(9L);

            assertThatCode(() -> validationService.validateEnrollment(student, section))
                    .doesNotThrowAnyException();
        }
    }
}
