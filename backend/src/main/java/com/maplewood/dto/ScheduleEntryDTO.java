package com.maplewood.dto;

import com.maplewood.model.Enrollment;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ScheduleEntryDTO {
    private Long enrollmentId;
    private Long sectionId;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private String teacherName;
    private String classroomName;
    private String days;
    private String startTime;
    private String endTime;
    private LocalDateTime enrolledAt;

    public static ScheduleEntryDTO fromEnrollment(Enrollment enrollment) {
        var section = enrollment.getSection();
        var course = section.getCourse();
        var slot = section.getTimeSlot();

        return ScheduleEntryDTO.builder()
                .enrollmentId(enrollment.getId())
                .sectionId(section.getId())
                .courseId(course.getId())
                .courseCode(course.getCode())
                .courseName(course.getName())
                .teacherName(section.getTeacher().getFullName())
                .classroomName(section.getClassroom().getName())
                .days(slot.getDays())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .enrolledAt(enrollment.getEnrolledAt())
                .build();
    }
}
