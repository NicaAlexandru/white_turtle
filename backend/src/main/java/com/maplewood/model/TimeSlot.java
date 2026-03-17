package com.maplewood.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "time_slots",
        uniqueConstraints = @UniqueConstraint(columnNames = {"days", "start_time"}))
@Getter
@Setter
@NoArgsConstructor
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "period_name", nullable = false, length = 30)
    private String periodName;

    @Column(name = "days", nullable = false, length = 10)
    private String days;

    @Column(name = "start_time", nullable = false, length = 5)
    private String startTime;

    @Column(name = "end_time", nullable = false, length = 5)
    private String endTime;

    public String getDisplayLabel() {
        return days + " " + startTime + "-" + endTime;
    }

    /**
     * Check whether this time slot overlaps with another.
     * Overlap occurs when the days intersect AND the time ranges overlap.
     */
    public boolean conflictsWith(TimeSlot other) {
        if (!daysOverlap(this.days, other.days)) {
            return false;
        }
        // Times overlap if one starts before the other ends and vice-versa
        return this.startTime.compareTo(other.endTime) < 0
                && other.startTime.compareTo(this.endTime) < 0;
    }

    private boolean daysOverlap(String days1, String days2) {
        for (char day : expandDays(days1).toCharArray()) {
            if (expandDays(days2).indexOf(day) >= 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Expand shorthand day codes into individual characters.
     * "MWF" -> "MWF", "TTh" -> "TH"
     */
    private String expandDays(String days) {
        return days.toUpperCase().replace("TH", "H");
    }
}
