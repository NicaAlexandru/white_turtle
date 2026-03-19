import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { Course, CourseSection } from '../../types';
import { formatTimeSlot } from '../../utils/format';

interface EnrollConfirmDialogProps {
  open: boolean;
  course: Course | null;
  section: CourseSection | null;
  enrolling: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const EnrollConfirmDialog: React.FC<EnrollConfirmDialogProps> = ({
  open,
  course,
  section,
  enrolling,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Enrollment</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          You are about to enroll in:
        </Typography>
        <Box mt={2} mb={1} p={2} bgcolor="grey.50" borderRadius={2}>
          <Typography variant="h6" gutterBottom>
            {course?.code} — Section {section?.sectionNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {course?.name}
          </Typography>
          <Box display="flex" gap={3} mt={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">Schedule</Typography>
              <Typography variant="body2">
                {section && formatTimeSlot(section.days, section.startTime, section.endTime)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Teacher</Typography>
              <Typography variant="body2">{section?.teacherName}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Room</Typography>
              <Typography variant="body2">{section?.classroomName}</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={onConfirm} disabled={enrolling} size="large">
          {enrolling ? 'Enrolling...' : 'Confirm Enrollment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EnrollConfirmDialog;
