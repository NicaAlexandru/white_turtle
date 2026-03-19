package com.maplewood.repository;

import com.maplewood.enums.EnrollmentStatus;
import com.maplewood.model.Enrollment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    @EntityGraph(attributePaths = {"section", "section.course", "section.teacher", "section.classroom", "section.timeSlot"})
    List<Enrollment> findByStudentIdAndStatusAndSectionSemesterIsActiveTrue(
            Long studentId, EnrollmentStatus status);

    @Query("SELECT COUNT(e) FROM Enrollment e " +
            "WHERE e.student.id = :studentId " +
            "AND e.status = 'enrolled' " +
            "AND e.section.semester.isActive = true")
    long countActiveByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(e) FROM Enrollment e " +
            "WHERE e.section.id = :sectionId " +
            "AND e.status = 'enrolled'")
    long countBySectionId(@Param("sectionId") Long sectionId);

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END " +
            "FROM Enrollment e " +
            "WHERE e.student.id = :studentId " +
            "AND e.section.course.id = :courseId " +
            "AND e.status = 'enrolled'")
    boolean isAlreadyEnrolledInCourse(@Param("studentId") Long studentId, @Param("courseId") Long courseId);
}
