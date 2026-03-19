package com.maplewood.service;

import com.maplewood.TestUtils;
import com.maplewood.dto.CourseDTO;
import com.maplewood.dto.CourseSectionDTO;
import com.maplewood.enums.CourseType;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.model.Course;
import com.maplewood.model.CourseSection;
import com.maplewood.repository.CourseRepository;
import com.maplewood.repository.CourseSectionRepository;
import com.maplewood.repository.EnrollmentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock private CourseRepository courseRepository;
    @Mock private CourseSectionRepository courseSectionRepository;
    @Mock private EnrollmentRepository enrollmentRepository;

    @InjectMocks
    private CourseService courseService;

    private final Pageable pageable = PageRequest.of(0, 10);

    @Test
    @DisplayName("Returns paginated courses matching filters")
    void getAllCourses() {
        Course c1 = TestUtils.course(10L, "ENG101", "English I", 9, 12, CourseType.core);
        Course c2 = TestUtils.course(11L, "ART101", "Art I", 9, 12, CourseType.elective);
        Page<Course> page = new PageImpl<>(List.of(c1, c2), pageable, 2);

        when(courseRepository.findWithFilters(eq(10), eq(1), isNull(), any(Pageable.class))).thenReturn(page);

        Page<CourseDTO> result = courseService.getAllCourses(10, 1, null, pageable);

        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent().get(0).getCode()).isEqualTo("ENG101");
        assertThat(result.getContent().get(1).getCourseType()).isEqualTo(CourseType.elective);
        assertThat(result.getTotalElements()).isEqualTo(2);
    }

    @Test
    @DisplayName("Returns empty page when no courses match")
    void noMatchingCourses() {
        Page<Course> empty = new PageImpl<>(List.of(), pageable, 0);
        when(courseRepository.findWithFilters(isNull(), isNull(), isNull(), any(Pageable.class))).thenReturn(empty);

        Page<CourseDTO> result = courseService.getAllCourses(null, null, null, pageable);

        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isZero();
    }

    @Test
    @DisplayName("Returns course by ID")
    void getCourseByIdSuccess() {
        Course course = TestUtils.course();
        when(courseRepository.findById(10L)).thenReturn(Optional.of(course));

        CourseDTO dto = courseService.getCourseById(10L);

        assertThat(dto.getCode()).isEqualTo("ENG101");
        assertThat(dto.getName()).isEqualTo("English I");
    }

    @Test
    @DisplayName("Throws when course not found")
    void getCourseByIdNotFound() {
        when(courseRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> courseService.getCourseById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Course not found");
    }

    @Test
    @DisplayName("Returns paginated sections for a specific course")
    void getSectionsForCourse() {
        CourseSection section = TestUtils.section();
        Page<CourseSection> page = new PageImpl<>(List.of(section), pageable, 1);

        when(courseSectionRepository.findByCourseIdAndSemesterIsActiveTrue(eq(10L), any(Pageable.class)))
                .thenReturn(page);
        when(enrollmentRepository.countBySectionId(100L)).thenReturn(5L);

        Page<CourseSectionDTO> result = courseService.getSections(10L, pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getEnrolledCount()).isEqualTo(5);
    }

    @Test
    @DisplayName("Returns all active sections when courseId is null")
    void getSectionsAllActive() {
        CourseSection section = TestUtils.section();
        Page<CourseSection> page = new PageImpl<>(List.of(section), pageable, 1);

        when(courseSectionRepository.findBySemesterIsActiveTrue(any(Pageable.class)))
                .thenReturn(page);
        when(enrollmentRepository.countBySectionId(100L)).thenReturn(0L);

        Page<CourseSectionDTO> result = courseService.getSections(null, pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getEnrolledCount()).isZero();
    }
}
