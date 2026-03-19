import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
  Tooltip,
} from '@mui/material';
import { Course } from '../../types';
import './CourseCard.css';

interface CourseCardProps {
  course: Course;
  onViewSections: (course: Course) => void;
  prerequisiteMet: boolean;
  alreadyEnrolled: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onViewSections,
  prerequisiteMet,
  alreadyEnrolled,
}) => {
  const canEnroll = prerequisiteMet && !alreadyEnrolled;

  let tooltipTitle = '';
  if (alreadyEnrolled) {
    tooltipTitle = 'Already enrolled in this course';
  } else if (!prerequisiteMet) {
    tooltipTitle = `Prerequisite required: ${course.prerequisiteCode}`;
  }

  return (
    <Card elevation={2} className="course-card">
      <CardContent className="course-card-content">
        <Box className="course-card-header">
          <Typography variant="subtitle2" className="course-card-code" color="primary">
            {course.code}
          </Typography>
          <Chip
            label={course.courseType}
            size="small"
            color={course.courseType === 'core' ? 'primary' : 'default'}
            variant="outlined"
          />
        </Box>

        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {course.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {course.description}
        </Typography>

        <Box className="course-card-chips">
          <Chip label={`${course.credits} credits`} size="small" />
          <Chip
            label={`Grades ${course.gradeLevelMin}-${course.gradeLevelMax}`}
            size="small"
            variant="outlined"
          />
          <Chip
            label={course.semesterOrder === 1 ? 'Fall' : 'Spring'}
            size="small"
            variant="outlined"
          />
        </Box>

        {course.prerequisiteCode && (
          <Typography variant="caption" color="text.secondary">
            Prerequisite: {course.prerequisiteCode}
          </Typography>
        )}
      </CardContent>

      <CardActions className="course-card-actions">
        <Tooltip title={tooltipTitle} arrow>
          <span>
            <Button
              variant={canEnroll ? 'contained' : 'outlined'}
              size="small"
              disabled={!canEnroll}
              onClick={() => onViewSections(course)}
              fullWidth
              disableRipple={!canEnroll}
            >
              {alreadyEnrolled ? '✓ Enrolled' : !prerequisiteMet ? 'Prerequisite Required' : 'View Sections'}
            </Button>
          </span>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default CourseCard;
