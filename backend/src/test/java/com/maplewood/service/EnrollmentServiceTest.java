package com.maplewood.service;

import com.maplewood.TestUtils;
import com.maplewood.dto.EnrollmentRequestDTO;
import com.maplewood.dto.EnrollmentResponseDTO;
import com.maplewood.enums.EnrollmentStatus;
import com.maplewood.enums.ValidationErrorType;
import com.maplewood.exception.EnrollmentValidationException;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.model.*;
import com.maplewood.repository.CourseSectionRepository;
import com.maplewood.repository.EnrollmentRepository;
import com.maplewood.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnrollmentServiceTest {

    @Mock private EnrollmentRepository enrollmentRepository;
    @Mock private CourseSectionRepository courseSectionRepository;
    @Mock private StudentRepository studentRepository;
    @Mock private ValidationService validationService;

    @InjectMocks
    private EnrollmentService enrollmentService;

    private Student student;
    private CourseSection section;
    private EnrollmentRequestDTO request;

    @BeforeEach
    void setUp() {
        student = TestUtils.student();
        section = TestUtils.section();

        request = new EnrollmentRequestDTO();
        request.setStudentId(1L);
        request.setSectionId(100L);
    }

    @Test
    @DisplayName("Successful enrollment creates enrollment and returns response")
    void enrollSuccess() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseSectionRepository.findById(100L)).thenReturn(Optional.of(section));
        doNothing().when(validationService).validateEnrollment(student, section);

        Enrollment saved = TestUtils.enrollment(200L, student, section);
        when(enrollmentRepository.save(any(Enrollment.class))).thenReturn(saved);

        EnrollmentResponseDTO response = enrollmentService.enroll(request);

        assertThat(response.getEnrollmentId()).isEqualTo(200L);
        assertThat(response.getMessage()).contains("Successfully enrolled");
        assertThat(response.getScheduleEntry()).isNotNull();
        assertThat(response.getScheduleEntry().getCourseCode()).isEqualTo("ENG101");

        ArgumentCaptor<Enrollment> captor = ArgumentCaptor.forClass(Enrollment.class);
        verify(enrollmentRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo(EnrollmentStatus.enrolled);
    }

    @Test
    @DisplayName("Enroll throws ResourceNotFoundException when student not found")
    void enrollStudentNotFound() {
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> enrollmentService.enroll(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Student not found");
    }

    @Test
    @DisplayName("Enroll throws ResourceNotFoundException when section not found")
    void enrollSectionNotFound() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseSectionRepository.findById(100L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> enrollmentService.enroll(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Section not found");
    }

    @Test
    @DisplayName("Enroll propagates validation exception from ValidationService")
    void enrollValidationFailure() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseSectionRepository.findById(100L)).thenReturn(Optional.of(section));
        doThrow(new EnrollmentValidationException(ValidationErrorType.max_courses, "Max reached"))
                .when(validationService).validateEnrollment(student, section);

        assertThatThrownBy(() -> enrollmentService.enroll(request))
                .isInstanceOf(EnrollmentValidationException.class)
                .satisfies(ex -> {
                    var e = (EnrollmentValidationException) ex;
                    assertThat(e.getType()).isEqualTo(ValidationErrorType.max_courses);
                });

        verify(enrollmentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Successful drop sets status to dropped")
    void dropSuccess() {
        Enrollment enrollment = TestUtils.enrollment(200L, student, section);
        when(enrollmentRepository.findById(200L)).thenReturn(Optional.of(enrollment));
        when(enrollmentRepository.save(any(Enrollment.class))).thenReturn(enrollment);

        enrollmentService.dropEnrollment(200L);

        ArgumentCaptor<Enrollment> captor = ArgumentCaptor.forClass(Enrollment.class);
        verify(enrollmentRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo(EnrollmentStatus.dropped);
    }

    @Test
    @DisplayName("Drop throws ResourceNotFoundException when enrollment not found")
    void dropNotFound() {
        when(enrollmentRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> enrollmentService.dropEnrollment(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Enrollment not found");
    }
}
