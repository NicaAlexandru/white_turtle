package com.maplewood.controller;

import com.maplewood.dto.*;
import com.maplewood.enums.CourseStatus;
import com.maplewood.exception.GlobalExceptionHandler;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.service.ScheduleService;
import com.maplewood.service.StudentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudentController.class)
@Import(GlobalExceptionHandler.class)
class StudentControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private StudentService studentService;
    @MockBean private ScheduleService scheduleService;

    @Test
    @DisplayName("GET /students/{id} — 200 with student profile")
    void getProfileSuccess() throws Exception {
        StudentProfileDTO profile = StudentProfileDTO.builder()
                .id(1L)
                .firstName("Alice")
                .lastName("Smith")
                .email("alice.smith@school.edu")
                .gradeLevel(10)
                .enrollmentYear(2023)
                .expectedGraduationYear(2027)
                .gpa(3.5)
                .creditsEarned(12.0)
                .creditsRequired(30.0)
                .courseHistory(List.of(
                        CourseHistoryDTO.builder()
                                .courseId(10L)
                                .courseCode("ENG101")
                                .courseName("English I")
                                .credits(3.0)
                                .semesterName("Fall 2023")
                                .status(CourseStatus.passed)
                                .build()
                ))
                .build();

        when(studentService.getStudentProfile(1L)).thenReturn(profile);

        mockMvc.perform(get("/students/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("Alice"))
                .andExpect(jsonPath("$.gpa").value(3.5))
                .andExpect(jsonPath("$.creditsEarned").value(12.0))
                .andExpect(jsonPath("$.courseHistory").isArray())
                .andExpect(jsonPath("$.courseHistory[0].courseCode").value("ENG101"));
    }

    @Test
    @DisplayName("GET /students/{id} — 404 when not found")
    void getProfileNotFound() throws Exception {
        when(studentService.getStudentProfile(999L))
                .thenThrow(new ResourceNotFoundException("Student not found with id: 999"));

        mockMvc.perform(get("/students/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.type").value("not_found"));
    }

    @Test
    @DisplayName("GET /students/{id}/schedule — 200 with schedule")
    void getScheduleSuccess() throws Exception {
        ScheduleDTO schedule = ScheduleDTO.builder()
                .studentId(1L)
                .studentName("Alice Smith")
                .semesterName("Fall 2024")
                .courseCount(2)
                .entries(List.of(
                        ScheduleEntryDTO.builder()
                                .enrollmentId(200L)
                                .courseCode("ENG101")
                                .courseName("English I")
                                .days("MWF")
                                .startTime("08:00")
                                .endTime("09:00")
                                .teacherName("John Doe")
                                .classroomName("Room 101")
                                .enrolledAt(LocalDateTime.of(2024, 9, 1, 10, 0))
                                .build(),
                        ScheduleEntryDTO.builder()
                                .enrollmentId(201L)
                                .courseCode("MAT101")
                                .courseName("Algebra I")
                                .days("TTh")
                                .startTime("09:00")
                                .endTime("10:00")
                                .teacherName("Jane Doe")
                                .classroomName("Room 102")
                                .enrolledAt(LocalDateTime.of(2024, 9, 1, 10, 5))
                                .build()
                ))
                .build();

        when(scheduleService.getStudentSchedule(1L)).thenReturn(schedule);

        mockMvc.perform(get("/students/1/schedule"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.studentName").value("Alice Smith"))
                .andExpect(jsonPath("$.semesterName").value("Fall 2024"))
                .andExpect(jsonPath("$.courseCount").value(2))
                .andExpect(jsonPath("$.entries").isArray())
                .andExpect(jsonPath("$.entries[0].courseCode").value("ENG101"))
                .andExpect(jsonPath("$.entries[1].courseCode").value("MAT101"));
    }

    @Test
    @DisplayName("GET /students/{id}/schedule — 404 when student not found")
    void getScheduleNotFound() throws Exception {
        when(scheduleService.getStudentSchedule(999L))
                .thenThrow(new ResourceNotFoundException("Student not found with id: 999"));

        mockMvc.perform(get("/students/999/schedule"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.type").value("not_found"));
    }
}
