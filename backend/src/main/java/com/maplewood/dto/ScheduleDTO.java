package com.maplewood.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ScheduleDTO {
    private Long studentId;
    private String studentName;
    private String semesterName;
    private Integer courseCount;
    private List<ScheduleEntryDTO> entries;
}
