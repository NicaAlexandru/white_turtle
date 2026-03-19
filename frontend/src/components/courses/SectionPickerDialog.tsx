import React, { useState } from 'react';
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
  Box,
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
  const [confirmSection, setConfirmSection] = useState<CourseSection | null>(null);

  const handleConfirmEnroll = () => {
    if (confirmSection) {
      onEnroll(confirmSection);
      setConfirmSection(null);
    }
  };

  const handleClose = () => {
    setConfirmSection(null);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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
                            onClick={() => setConfirmSection(section)}
                          >
                            Enroll
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
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation dialog */}
      <Dialog open={!!confirmSection} onClose={() => setConfirmSection(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Enrollment</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" gutterBottom>
            You are about to enroll in:
          </Typography>
          <Box mt={2} mb={1} p={2} bgcolor="grey.50" borderRadius={2}>
            <Typography variant="h6" gutterBottom>
              {course?.code} — Section {confirmSection?.sectionNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {course?.name}
            </Typography>
            <Box display="flex" gap={3} mt={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">Schedule</Typography>
                <Typography variant="body2">
                  {confirmSection && formatTimeSlot(confirmSection.days, confirmSection.startTime, confirmSection.endTime)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Teacher</Typography>
                <Typography variant="body2">{confirmSection?.teacherName}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Room</Typography>
                <Typography variant="body2">{confirmSection?.classroomName}</Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmSection(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmEnroll} disabled={enrolling} size="large">
            {enrolling ? 'Enrolling...' : 'Confirm Enrollment'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SectionPickerDialog;
