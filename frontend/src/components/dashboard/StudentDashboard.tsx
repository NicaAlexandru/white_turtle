import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useAppSelector } from '../../store/hooks';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import StatCard from './StatCard';
import GraduationProgress from './GraduationProgress';
import CourseHistory from './CourseHistory';
import './StudentDashboard.css';

const StudentDashboard: React.FC = () => {
  const { profile, status, error } = useAppSelector((state) => state.student);

  if (status === 'loading') return <LoadingSpinner message="Loading student profile..." />;
  if (status === 'failed') return <ErrorAlert message={error || 'Failed to load profile'} />;
  if (!profile) return null;

  const passedCourses = profile.courseHistory.filter((h) => h.status === 'passed').length;
  const failedCourses = profile.courseHistory.filter((h) => h.status === 'failed').length;

  return (
    <Box>
      <Box className="student-header">
        <Typography variant="h5" className="student-header-name">
          {profile.firstName} {profile.lastName}
        </Typography>
        <Typography variant="body2" className="student-header-details">
          Grade {profile.gradeLevel} &bull; {profile.email}
        </Typography>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<TrendingUpIcon color="primary" />}
            label="GPA"
            value={profile.gpa.toFixed(2)}
            valueColor="primary.main"
            caption="out of 4.00"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<MenuBookIcon color="primary" />}
            label="Credits Earned"
            value={profile.creditsEarned}
            valueColor="primary.main"
            caption={`of ${profile.creditsRequired} required`}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<EmojiEventsIcon color="primary" />}
            label="Courses"
            value={passedCourses}
            valueColor="primary.main"
            extra={
              <Typography variant="body2" color="text.secondary">
                passed
              </Typography>
            }
            caption={failedCourses > 0 ? `${failedCourses} failed` : undefined}
          />
        </Grid>
      </Grid>

      <Box mb={4}>
        <GraduationProgress
          creditsEarned={profile.creditsEarned}
          creditsRequired={profile.creditsRequired}
        />
      </Box>

      <CourseHistory history={profile.courseHistory} />
    </Box>
  );
};

export default StudentDashboard;
