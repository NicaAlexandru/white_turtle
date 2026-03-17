package com.maplewood.repository;

import com.maplewood.model.CourseSection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseSectionRepository extends JpaRepository<CourseSection, Long> {

    @EntityGraph(attributePaths = {"course", "teacher", "classroom", "timeSlot"})
    Page<CourseSection> findBySemesterIsActiveTrue(Pageable pageable);

    @EntityGraph(attributePaths = {"course", "teacher", "classroom", "timeSlot"})
    Page<CourseSection> findByCourseIdAndSemesterIsActiveTrue(Long courseId, Pageable pageable);

    @EntityGraph(attributePaths = {"course", "course.prerequisite", "teacher", "classroom", "timeSlot", "semester"})
    Optional<CourseSection> findById(Long id);
}
