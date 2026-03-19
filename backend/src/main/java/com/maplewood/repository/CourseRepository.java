package com.maplewood.repository;

import com.maplewood.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    @EntityGraph(attributePaths = {"prerequisite", "specialization"})
    @Query("SELECT c FROM Course c " +
            "WHERE (:grade IS NULL OR (c.gradeLevelMin <= :grade AND c.gradeLevelMax >= :grade)) " +
            "AND (:semesterOrder IS NULL OR c.semesterOrder = :semesterOrder) " +
            "AND (:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "     OR LOWER(c.code) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "ORDER BY c.code")
    Page<Course> findWithFilters(@Param("grade") Integer grade,
                                @Param("semesterOrder") Integer semesterOrder,
                                @Param("search") String search,
                                Pageable pageable);

    @EntityGraph(attributePaths = {"prerequisite", "specialization"})
    Optional<Course> findById(Long id);
}
