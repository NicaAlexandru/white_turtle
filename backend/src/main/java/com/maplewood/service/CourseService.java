package com.maplewood.service;

import com.maplewood.dto.CourseDTO;
import com.maplewood.dto.CourseSectionDTO;
import com.maplewood.exception.ResourceNotFoundException;
import com.maplewood.model.Course;
import com.maplewood.repository.CourseRepository;
import com.maplewood.repository.CourseSectionRepository;
import com.maplewood.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseSectionRepository courseSectionRepository;
    private final EnrollmentRepository enrollmentRepository;

    public Page<CourseDTO> getAllCourses(Integer grade, Integer semesterOrder, Pageable pageable) {
        return courseRepository.findWithFilters(grade, semesterOrder, pageable)
                .map(CourseDTO::fromEntity);
    }

    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return CourseDTO.fromEntity(course);
    }

    public Page<CourseSectionDTO> getSections(Long courseId, Pageable pageable) {
        var sections = courseId != null
                ? courseSectionRepository.findByCourseIdAndSemesterIsActiveTrue(courseId, pageable)
                : courseSectionRepository.findBySemesterIsActiveTrue(pageable);

        return sections.map(section -> {
            long enrolled = enrollmentRepository.countBySectionId(section.getId());
            return CourseSectionDTO.fromEntity(section, enrolled);
        });
    }
}
