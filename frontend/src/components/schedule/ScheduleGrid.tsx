import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { ScheduleEntry } from '../../types';
import { expandDays } from '../../utils/format';
import { TIME_SLOTS, DAY_COLUMNS, COURSE_COLORS, LUNCH_START_TIME } from '../../constants/schedule';
import './ScheduleGrid.css';

interface ScheduleGridProps {
  entries: ScheduleEntry[];
  onDropCourse: (enrollmentId: number) => void;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ entries, onDropCourse }) => {
  const colorMap: Record<number, string> = {};
  entries.forEach((entry, index) => {
    if (!colorMap[entry.courseId]) {
      colorMap[entry.courseId] = COURSE_COLORS[index % COURSE_COLORS.length];
    }
  });

  const getEntryForSlot = (dayKey: string, startTime: string): ScheduleEntry | undefined => {
    return entries.find((entry) => {
      const entryDays = expandDays(entry.days);
      return entryDays.includes(dayKey) && entry.startTime === startTime;
    });
  };

  return (
    <TableContainer component={Paper} elevation={2}>
        <Table size="small" className="grid-table">
        <TableHead>
          <TableRow>
            <TableCell className="grid-header-cell grid-time-column">Time</TableCell>
            {DAY_COLUMNS.map((day) => (
              <TableCell key={day.key} align="center" className="grid-header-cell">
                {day.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {TIME_SLOTS.map((slot) => (
            <TableRow key={slot.start}>
              <TableCell className="grid-time-cell">{slot.label}</TableCell>
              {DAY_COLUMNS.map((day) => {
                if (slot.start === LUNCH_START_TIME) {
                  return (
                    <TableCell key={day.key} align="center" className="grid-lunch-cell">
                      Lunch
                    </TableCell>
                  );
                }

                const entry = getEntryForSlot(day.key, slot.start);
                if (!entry) {
                  return <TableCell key={day.key} className="grid-empty-cell" />;
                }

                const bgColor = colorMap[entry.courseId] || COURSE_COLORS[0];

                return (
                  <TableCell
                    key={day.key}
                    align="center"
                    className="grid-course-cell"
                    style={{ backgroundColor: bgColor }}
                    onClick={() => onDropCourse(entry.enrollmentId)}
                  >
                    <Box>
                      <Typography variant="caption" display="block" className="grid-course-code">
                        {entry.courseCode}
                      </Typography>
                      <Typography variant="caption" display="block" className="grid-course-room">
                        {entry.classroomName}
                      </Typography>
                    </Box>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ScheduleGrid;
