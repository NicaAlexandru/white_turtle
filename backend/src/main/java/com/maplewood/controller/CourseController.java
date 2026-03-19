package com.maplewood.controller;

import com.maplewood.dto.CourseDTO;
import com.maplewood.dto.CourseSectionDTO;
import com.maplewood.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<Page<CourseDTO>> getCourses(
        @RequestParam(required = false) Integer grade,
        @RequestParam(required = false) Integer semester,
        @RequestParam(required = false) String search,
        @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(courseService.getAllCourses(grade, semester, search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/sections")
    public ResponseEntity<Page<CourseSectionDTO>> getSections(
        @RequestParam(required = false) Long courseId,
        @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(courseService.getSections(courseId, pageable));
    }
}
