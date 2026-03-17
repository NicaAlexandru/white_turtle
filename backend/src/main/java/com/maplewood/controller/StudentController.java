package com.maplewood.controller;

import com.maplewood.dto.ScheduleDTO;
import com.maplewood.dto.StudentProfileDTO;
import com.maplewood.service.ScheduleService;
import com.maplewood.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final ScheduleService scheduleService;

    @GetMapping("/{id}")
    public ResponseEntity<StudentProfileDTO> getStudentProfile(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentProfile(id));
    }

    @GetMapping("/{id}/schedule")
    public ResponseEntity<ScheduleDTO> getStudentSchedule(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.getStudentSchedule(id));
    }
}
