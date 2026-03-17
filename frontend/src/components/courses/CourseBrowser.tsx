import React, { useEffect, useState, useCallback } from 'react';
import { Box, Grid, Typography, Pagination } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCourses, fetchSections, setFilters, clearFilters, setCoursePage } from '../../store/slices/coursesSlice';
import { enrollInSection, clearValidationError, clearSuccessMessage, fetchSchedule } from '../../store/slices/scheduleSlice';
import { Course, CourseSection } from '../../types';
import CourseCard from './CourseCard';
import CourseFilters from './CourseFilters';
import SectionPickerDialog from './SectionPickerDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import SuccessSnackbar from '../common/SuccessSnackbar';

const CourseBrowser: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    items: courses, filters, status, sections, sectionsStatus, error, pagination,
  } = useAppSelector((state) => state.courses);
  const { selectedStudentId, profile } = useAppSelector((state) => state.student);
  const { schedule, enrolling, validationError, successMessage } = useAppSelector(
    (state) => state.schedule
  );

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCourses({
      grade: filters.grade,
      semester: filters.semester,
      page: pagination.page,
    }));
  }, [dispatch, filters.grade, filters.semester, pagination.page]);

  const handleGradeChange = useCallback(
    (grade?: number) => dispatch(setFilters({ ...filters, grade })),
    [dispatch, filters]
  );

  const handleSemesterChange = useCallback(
    (semester?: number) => dispatch(setFilters({ ...filters, semester })),
    [dispatch, filters]
  );

  const handleClearFilters = useCallback(() => dispatch(clearFilters()), [dispatch]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setCoursePage(page - 1));
  };

  const handleViewSections = (course: Course) => {
    setSelectedCourse(course);
    setSectionDialogOpen(true);
    dispatch(fetchSections({ courseId: course.id }));
  };

  const handleEnroll = async (section: CourseSection) => {
    await dispatch(enrollInSection({ studentId: selectedStudentId, sectionId: section.id }));
    dispatch(fetchSchedule(selectedStudentId));
    setSectionDialogOpen(false);
  };

  const isPrerequisiteMet = (course: Course): boolean => {
    if (!course.prerequisiteId) return true;
    if (!profile) return false;
    return profile.courseHistory.some(
      (h) => h.courseId === course.prerequisiteId && h.status === 'passed'
    );
  };

  const isAlreadyEnrolled = (course: Course): boolean => {
    if (!schedule) return false;
    return schedule.entries.some((e) => e.courseId === course.id);
  };

  if (status === 'loading') return <LoadingSpinner message="Loading courses..." />;
  if (status === 'failed') return <ErrorAlert message={error || 'Failed to load courses'} />;

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Course Catalog
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {pagination.totalElements} courses available
      </Typography>

      <CourseFilters
        grade={filters.grade}
        semester={filters.semester}
        onGradeChange={handleGradeChange}
        onSemesterChange={handleSemesterChange}
        onClear={handleClearFilters}
      />

      <Grid container spacing={2}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
            <CourseCard
              course={course}
              onViewSections={handleViewSections}
              prerequisiteMet={isPrerequisiteMet(course)}
              alreadyEnrolled={isAlreadyEnrolled(course)}
            />
          </Grid>
        ))}
      </Grid>

      {courses.length === 0 && status === 'succeeded' && (
        <Box textAlign="center" py={6}>
          <Typography color="text.secondary">No courses match the selected filters.</Typography>
        </Box>
      )}

      {pagination.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page + 1}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      <SectionPickerDialog
        open={sectionDialogOpen}
        course={selectedCourse}
        sections={sections}
        sectionsStatus={sectionsStatus}
        enrolling={enrolling}
        validationError={validationError}
        onEnroll={handleEnroll}
        onClose={() => setSectionDialogOpen(false)}
        onClearError={() => dispatch(clearValidationError())}
      />

      <SuccessSnackbar message={successMessage} onClose={() => dispatch(clearSuccessMessage())} />
    </Box>
  );
};

export default CourseBrowser;
