package com.maplewood.dto;

import com.maplewood.enums.CourseType;
import com.maplewood.model.Course;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseDTO {
    private Long id;
    private String code;
    private String name;
    private String description;
    private Double credits;
    private CourseType courseType;
    private Integer gradeLevelMin;
    private Integer gradeLevelMax;
    private Integer semesterOrder;
    private String specialization;
    private Long prerequisiteId;
    private String prerequisiteCode;

    public static CourseDTO fromEntity(Course course) {
        var builder = CourseDTO.builder()
                .id(course.getId())
                .code(course.getCode())
                .name(course.getName())
                .description(course.getDescription())
                .credits(course.getCredits())
                .courseType(course.getCourseType())
                .gradeLevelMin(course.getGradeLevelMin())
                .gradeLevelMax(course.getGradeLevelMax())
                .semesterOrder(course.getSemesterOrder());

        if (course.getSpecialization() != null) {
            builder.specialization(course.getSpecialization().getName());
        }

        if (course.getPrerequisite() != null) {
            builder.prerequisiteId(course.getPrerequisite().getId())
                .prerequisiteCode(course.getPrerequisite().getCode());
        }
        
        return builder.build();
    }
}
