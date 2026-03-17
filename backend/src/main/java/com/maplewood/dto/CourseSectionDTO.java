package com.maplewood.dto;

import com.maplewood.model.CourseSection;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseSectionDTO {
    private Long id;
    private String sectionNumber;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private String teacherName;
    private String classroomName;
    private String days;
    private String startTime;
    private String endTime;
    private Integer maxCapacity;
    private Long enrolledCount;

    public static CourseSectionDTO fromEntity(CourseSection section, long enrolledCount) {
        return CourseSectionDTO.builder()
                .id(section.getId())
                .sectionNumber(section.getSectionNumber())
                .courseId(section.getCourse().getId())
                .courseCode(section.getCourse().getCode())
                .courseName(section.getCourse().getName())
                .teacherName(section.getTeacher().getFullName())
                .classroomName(section.getClassroom().getName())
                .days(section.getTimeSlot().getDays())
                .startTime(section.getTimeSlot().getStartTime())
                .endTime(section.getTimeSlot().getEndTime())
                .maxCapacity(section.getMaxCapacity())
                .enrolledCount(enrolledCount)
                .build();
    }
}
