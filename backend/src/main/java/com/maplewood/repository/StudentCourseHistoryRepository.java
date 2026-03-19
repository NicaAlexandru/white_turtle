package com.maplewood.repository;

import com.maplewood.model.StudentCourseHistory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentCourseHistoryRepository extends JpaRepository<StudentCourseHistory, Long> {

    @EntityGraph(attributePaths = {"course", "semester"})
    @Query("SELECT h FROM StudentCourseHistory h " +
            "WHERE h.student.id = :studentId " +
            "ORDER BY h.semester.year, h.semester.orderInYear")
    List<StudentCourseHistory> findByStudentIdWithDetails(@Param("studentId") Long studentId);

    @Query("SELECT CASE WHEN COUNT(h) > 0 THEN true ELSE false END " +
            "FROM StudentCourseHistory h " +
            "WHERE h.student.id = :studentId " +
            "AND h.course.id = :courseId " +
            "AND h.status = 'passed'")
    boolean hasPassedCourse(@Param("studentId") Long studentId, @Param("courseId") Long courseId);
}
