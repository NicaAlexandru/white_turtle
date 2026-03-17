import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
} from '@mui/material';
import { Course, CourseSection, ValidationError, LoadingStatus } from '../../types';
import { formatTimeSlot } from '../../utils/format';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

interface SectionPickerDialogProps {
  open: boolean;
  course: Course | null;
  sections: CourseSection[];
  sectionsStatus: LoadingStatus;
  enrolling: boolean;
  validationError: ValidationError | null;
  onEnroll: (section: CourseSection) => void;
  onClose: () => void;
  onClearError: () => void;
}

const SectionPickerDialog: React.FC<SectionPickerDialogProps> = ({
  open,
  course,
  sections,
  sectionsStatus,
  enrolling,
  validationError,
  onEnroll,
  onClose,
  onClearError,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {course?.code} - {course?.name}
        <Typography variant="body2" color="text.secondary">
          Select a section to enroll
        </Typography>
      </DialogTitle>
      <DialogContent>
        {validationError && (
          <ErrorAlert
            title="Enrollment Failed"
            message={validationError.message}
            onClose={onClearError}
          />
        )}
        {sectionsStatus === 'loading' ? (
          <LoadingSpinner message="Loading sections..." />
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Section</strong></TableCell>
                  <TableCell><strong>Schedule</strong></TableCell>
                  <TableCell><strong>Teacher</strong></TableCell>
                  <TableCell><strong>Room</strong></TableCell>
                  <TableCell><strong>Seats</strong></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sections.map((section) => {
                  const isFull = section.enrolledCount >= section.maxCapacity;
                  return (
                    <TableRow key={section.id} hover>
                      <TableCell>{section.sectionNumber}</TableCell>
                      <TableCell>
                        {formatTimeSlot(section.days, section.startTime, section.endTime)}
                      </TableCell>
                      <TableCell>{section.teacherName}</TableCell>
                      <TableCell>{section.classroomName}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${section.enrolledCount}/${section.maxCapacity}`}
                          size="small"
                          color={isFull ? 'error' : 'success'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          disabled={isFull || enrolling}
                          onClick={() => onEnroll(section)}
                        >
                          {enrolling ? 'Enrolling...' : 'Enroll'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {sections.length === 0 && sectionsStatus === 'succeeded' && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary" py={2}>
                        No sections available for this course.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SectionPickerDialog;
