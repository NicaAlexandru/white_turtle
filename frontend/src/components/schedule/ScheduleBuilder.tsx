import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchSchedule,
  dropEnrollment,
  clearValidationError,
  clearSuccessMessage,
} from '../../store/slices/scheduleSlice';
import { MAX_COURSES_PER_SEMESTER } from '../../constants/schedule';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import ScheduleGrid from './ScheduleGrid';
import EnrolledCoursesTable from './EnrolledCoursesTable';
import DropConfirmDialog from './DropConfirmDialog';
import SuccessSnackbar from '../common/SuccessSnackbar';

const ScheduleBuilder: React.FC = () => {
  const dispatch = useAppDispatch();
  const { schedule, status, error, dropping, validationError, successMessage } = useAppSelector(
    (state) => state.schedule
  );
  const { selectedStudentId } = useAppSelector((state) => state.student);

  const [dropConfirmId, setDropConfirmId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchSchedule(selectedStudentId));
  }, [dispatch, selectedStudentId]);

  const handleDropConfirm = async () => {
    if (dropConfirmId !== null) {
      await dispatch(dropEnrollment(dropConfirmId));
      setDropConfirmId(null);
    }
  };

  if (status === 'loading') return <LoadingSpinner message="Loading schedule..." />;
  if (status === 'failed') return <ErrorAlert message={error || 'Failed to load schedule'} />;
  if (!schedule) return null;

  const dropEntry = schedule.entries.find((e) => e.enrollmentId === dropConfirmId);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Schedule Builder
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {schedule.semesterName} &bull; {schedule.studentName}
          </Typography>
        </Box>
        <Chip
          label={`${schedule.courseCount} / ${MAX_COURSES_PER_SEMESTER} courses`}
          color={schedule.courseCount >= MAX_COURSES_PER_SEMESTER ? 'error' : 'primary'}
        />
      </Box>

      {validationError && (
        <ErrorAlert
          title="Error"
          message={validationError.message}
          onClose={() => dispatch(clearValidationError())}
        />
      )}

      <Box mb={4}>
        <ScheduleGrid entries={schedule.entries} onDropCourse={setDropConfirmId} />
        <Typography variant="caption" color="text.secondary" mt={1} display="block">
          Click on a course in the grid to drop it.
        </Typography>
      </Box>

      <EnrolledCoursesTable
        entries={schedule.entries}
        dropping={dropping}
        onDropRequest={setDropConfirmId}
      />

      <DropConfirmDialog
        entry={dropEntry}
        open={dropConfirmId !== null}
        dropping={dropping}
        onConfirm={handleDropConfirm}
        onCancel={() => setDropConfirmId(null)}
      />

      <SuccessSnackbar message={successMessage} onClose={() => dispatch(clearSuccessMessage())} />
    </Box>
  );
};

export default ScheduleBuilder;
