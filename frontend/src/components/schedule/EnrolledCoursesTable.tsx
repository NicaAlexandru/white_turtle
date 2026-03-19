import React from 'react';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ScheduleEntry } from '../../types';
import { formatTimeSlot } from '../../utils/format';

interface EnrolledCoursesTableProps {
  entries: ScheduleEntry[];
  dropping: boolean;
  onDropRequest: (enrollmentId: number) => void;
}

const EnrolledCoursesTable: React.FC<EnrolledCoursesTableProps> = ({
  entries,
  dropping,
  onDropRequest,
}) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Enrolled Courses
        </Typography>
        {entries.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={3}>
            No courses enrolled yet. Browse courses to add to your schedule.
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Code</strong></TableCell>
                  <TableCell><strong>Course</strong></TableCell>
                  <TableCell><strong>Credits</strong></TableCell>
                  <TableCell><strong>Schedule</strong></TableCell>
                  <TableCell><strong>Teacher</strong></TableCell>
                  <TableCell><strong>Room</strong></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.enrollmentId} hover>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {entry.courseCode}
                      </Typography>
                    </TableCell>
                    <TableCell>{entry.courseName}</TableCell>
                    <TableCell>{entry.credits}</TableCell>
                    <TableCell>
                      {formatTimeSlot(entry.days, entry.startTime, entry.endTime)}
                    </TableCell>
                    <TableCell>{entry.teacherName}</TableCell>
                    <TableCell>{entry.classroomName}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDropRequest(entry.enrollmentId)}
                        disabled={dropping}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EnrolledCoursesTable;
