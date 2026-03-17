package com.maplewood.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationErrorDTO {
    private String type; // prerequisite, conflict, max_courses, grade_level, capacity, duplicate, other
    private String message;
}
