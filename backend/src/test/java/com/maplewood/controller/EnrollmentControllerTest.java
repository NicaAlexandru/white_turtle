package com.maplewood.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maplewood.dto.EnrollmentRequestDTO;
import com.maplewood.dto.EnrollmentResponseDTO;
import com.maplewood.dto.ScheduleEntryDTO;
import com.maplewood.enums.ValidationErrorType;
import com.maplewood.exception.EnrollmentValidationException;
import com.maplewood.exception.GlobalExceptionHandler;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.service.EnrollmentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EnrollmentController.class)
@Import(GlobalExceptionHandler.class)
class EnrollmentControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean private EnrollmentService enrollmentService;

    @Test
    @DisplayName("POST /enrollments — 201 on successful enrollment")
    void enrollSuccess() throws Exception {
        EnrollmentResponseDTO response = EnrollmentResponseDTO.builder()
                .enrollmentId(200L)
                .message("Successfully enrolled in English I")
                .scheduleEntry(ScheduleEntryDTO.builder()
                        .enrollmentId(200L)
                        .courseCode("ENG101")
                        .courseName("English I")
                        .days("MWF")
                        .startTime("08:00")
                        .endTime("09:00")
                        .enrolledAt(LocalDateTime.of(2024, 9, 1, 10, 0))
                        .build())
                .build();

        when(enrollmentService.enroll(any(EnrollmentRequestDTO.class))).thenReturn(response);

        String body = objectMapper.writeValueAsString(requestDto(1L, 100L));

        mockMvc.perform(post("/enrollments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.enrollmentId").value(200))
                .andExpect(jsonPath("$.message").value("Successfully enrolled in English I"))
                .andExpect(jsonPath("$.scheduleEntry.courseCode").value("ENG101"));
    }

    @Test
    @DisplayName("POST /enrollments — 409 on validation failure")
    void enrollValidationFailure() throws Exception {
        when(enrollmentService.enroll(any(EnrollmentRequestDTO.class)))
                .thenThrow(new EnrollmentValidationException(
                        ValidationErrorType.max_courses, "Maximum of 5 courses per semester reached"));

        String body = objectMapper.writeValueAsString(requestDto(1L, 100L));

        mockMvc.perform(post("/enrollments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.type").value("max_courses"))
                .andExpect(jsonPath("$.message").value("Maximum of 5 courses per semester reached"));
    }

    @Test
    @DisplayName("POST /enrollments — 404 when student or section not found")
    void enrollNotFound() throws Exception {
        when(enrollmentService.enroll(any(EnrollmentRequestDTO.class)))
                .thenThrow(new ResourceNotFoundException("Student not found with id: 999"));

        String body = objectMapper.writeValueAsString(requestDto(999L, 100L));

        mockMvc.perform(post("/enrollments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.type").value("not_found"));
    }

    @Test
    @DisplayName("POST /enrollments — 400 when request body missing required fields")
    void enrollBadRequest() throws Exception {
        mockMvc.perform(post("/enrollments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.type").value("validation"));
    }

    @Test
    @DisplayName("DELETE /enrollments/{id} — 204 on successful drop")
    void dropSuccess() throws Exception {
        doNothing().when(enrollmentService).dropEnrollment(200L);

        mockMvc.perform(delete("/enrollments/200"))
                .andExpect(status().isNoContent());

        verify(enrollmentService).dropEnrollment(200L);
    }

    @Test
    @DisplayName("DELETE /enrollments/{id} — 404 when enrollment not found")
    void dropNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Enrollment not found with id: 999"))
                .when(enrollmentService).dropEnrollment(999L);

        mockMvc.perform(delete("/enrollments/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.type").value("not_found"));
    }

    private EnrollmentRequestDTO requestDto(Long studentId, Long sectionId) {
        EnrollmentRequestDTO dto = new EnrollmentRequestDTO();
        dto.setStudentId(studentId);
        dto.setSectionId(sectionId);
        return dto;
    }
}
