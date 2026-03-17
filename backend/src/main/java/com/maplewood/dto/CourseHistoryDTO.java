package com.maplewood.dto;

import com.maplewood.enums.CourseStatus;
import com.maplewood.model.StudentCourseHistory;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseHistoryDTO {
    private Long courseId;
    private String courseCode;
    private String courseName;
    private Double credits;
    private String semesterName;
    private CourseStatus status;

    public static CourseHistoryDTO fromEntity(StudentCourseHistory history) {
        return CourseHistoryDTO.builder()
                .courseId(history.getCourse().getId())
                .courseCode(history.getCourse().getCode())
                .courseName(history.getCourse().getName())
                .credits(history.getCourse().getCredits())
                .semesterName(history.getSemester().getDisplayName())
                .status(history.getStatus())
                .build();
    }
}
