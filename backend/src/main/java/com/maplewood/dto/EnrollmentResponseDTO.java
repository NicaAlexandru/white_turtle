package com.maplewood.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EnrollmentResponseDTO {
    private Long enrollmentId;
    private String message;
    private ScheduleEntryDTO scheduleEntry;
}
