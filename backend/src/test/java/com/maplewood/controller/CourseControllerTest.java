package com.maplewood.controller;

import com.maplewood.dto.CourseDTO;
import com.maplewood.dto.CourseSectionDTO;
import com.maplewood.enums.CourseType;
import com.maplewood.exception.GlobalExceptionHandler;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.service.CourseService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CourseController.class)
@Import(GlobalExceptionHandler.class)
class CourseControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private CourseService courseService;

    @Test
    @DisplayName("GET /courses — 200 with paginated courses")
    void getCoursesSuccess() throws Exception {
        CourseDTO dto = CourseDTO.builder()
                .id(10L).code("ENG101").name("English I")
                .credits(3.0).courseType(CourseType.core)
                .gradeLevelMin(9).gradeLevelMax(12)
                .semesterOrder(1)
                .build();

        Page<CourseDTO> page = new PageImpl<>(List.of(dto), PageRequest.of(0, 10), 1);
        when(courseService.getAllCourses(isNull(), isNull(), isNull(), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].code").value("ENG101"))
                .andExpect(jsonPath("$.content[0].courseType").value("core"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    @DisplayName("GET /courses?grade=10&semester=1 — filters applied")
    void getCoursesWithFilters() throws Exception {
        Page<CourseDTO> page = new PageImpl<>(List.of(), PageRequest.of(0, 10), 0);
        when(courseService.getAllCourses(eq(10), eq(1), isNull(), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/courses")
                        .param("grade", "10")
                        .param("semester", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isEmpty())
                .andExpect(jsonPath("$.totalElements").value(0));
    }

    @Test
    @DisplayName("GET /courses/{id} — 200 with course details")
    void getCourseByIdSuccess() throws Exception {
        CourseDTO dto = CourseDTO.builder()
                .id(10L).code("ENG101").name("English I")
                .credits(3.0).courseType(CourseType.core)
                .gradeLevelMin(9).gradeLevelMax(12).semesterOrder(1)
                .build();

        when(courseService.getCourseById(10L)).thenReturn(dto);

        mockMvc.perform(get("/courses/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("ENG101"))
                .andExpect(jsonPath("$.name").value("English I"));
    }

    @Test
    @DisplayName("GET /courses/{id} — 404 when not found")
    void getCourseByIdNotFound() throws Exception {
        when(courseService.getCourseById(999L))
                .thenThrow(new ResourceNotFoundException("Course not found with id: 999"));

        mockMvc.perform(get("/courses/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.type").value("not_found"));
    }

    @Test
    @DisplayName("GET /courses/sections — 200 with paginated sections")
    void getSectionsSuccess() throws Exception {
        CourseSectionDTO dto = CourseSectionDTO.builder()
                .id(100L).sectionNumber("A")
                .courseId(10L).courseCode("ENG101").courseName("English I")
                .teacherName("John Doe").classroomName("Room 101")
                .days("MWF").startTime("08:00").endTime("09:00")
                .maxCapacity(10).enrolledCount(5L)
                .build();

        Page<CourseSectionDTO> page = new PageImpl<>(List.of(dto), PageRequest.of(0, 10), 1);
        when(courseService.getSections(isNull(), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/courses/sections"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].sectionNumber").value("A"))
                .andExpect(jsonPath("$.content[0].courseCode").value("ENG101"))
                .andExpect(jsonPath("$.content[0].enrolledCount").value(5))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    @DisplayName("GET /courses/sections?courseId=10 — filtered by course")
    void getSectionsFilteredByCourse() throws Exception {
        CourseSectionDTO dto = CourseSectionDTO.builder()
                .id(100L).sectionNumber("A")
                .courseId(10L).courseCode("ENG101").courseName("English I")
                .teacherName("John Doe").classroomName("Room 101")
                .days("MWF").startTime("08:00").endTime("09:00")
                .maxCapacity(10).enrolledCount(3L)
                .build();

        Page<CourseSectionDTO> page = new PageImpl<>(List.of(dto), PageRequest.of(0, 10), 1);
        when(courseService.getSections(eq(10L), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/courses/sections").param("courseId", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].courseCode").value("ENG101"));
    }
}
