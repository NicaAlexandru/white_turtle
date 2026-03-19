import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCourses, fetchSections, setFilters, clearFilters, setCoursePage, setPageSize } from '../../store/slices/coursesSlice';
import { enrollInSection, clearValidationError, clearSuccessMessage, fetchSchedule } from '../../store/slices/scheduleSlice';
import { Course, CourseSection } from '../../types';
import CourseCard from './CourseCard';
import CourseFilters from './CourseFilters';
import SectionPickerDialog from './SectionPickerDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import SuccessSnackbar from '../common/SuccessSnackbar';
import PaginationBar from '../common/PaginationBar';

const SEARCH_DEBOUNCE_MS = 600;

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
  const [searchText, setSearchText] = useState(filters.search || '');
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    dispatch(fetchCourses({
      grade: filters.grade,
      semester: filters.semester,
      search: filters.search,
      page: pagination.page,
      size: pagination.size,
    }));
  }, [dispatch, filters.grade, filters.semester, filters.search, pagination.page, pagination.size]);

  useEffect(() => {
    return () => { clearTimeout(searchTimer.current); };
  }, []);

  const handleGradeChange = useCallback(
    (grade?: number) => dispatch(setFilters({ ...filters, grade })),
    [dispatch, filters]
  );

  const handleSemesterChange = useCallback(
    (semester?: number) => dispatch(setFilters({ ...filters, semester })),
    [dispatch, filters]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value);
    clearTimeout(searchTimer.current);
    if (value === '') {
      dispatch(setFilters({ ...filters, search: undefined }));
    } else {
      searchTimer.current = setTimeout(() => {
        dispatch(setFilters({ ...filters, search: value }));
      }, SEARCH_DEBOUNCE_MS);
    }
  }, [dispatch, filters]);

  const handleClearFilters = useCallback(() => {
    setSearchText('');
    clearTimeout(searchTimer.current);
    dispatch(clearFilters());
  }, [dispatch]);

  const handlePageChange = (page: number) => dispatch(setCoursePage(page));

  const handleViewSections = (course: Course) => {
    setSelectedCourse(course);
    setSectionDialogOpen(true);
    dispatch(fetchSections({ courseId: course.id }));
  };

  const handleEnroll = async (section: CourseSection) => {
    const result = await dispatch(enrollInSection({ studentId: selectedStudentId, sectionId: section.id }));
    if (enrollInSection.fulfilled.match(result)) {
      setSectionDialogOpen(false);
      dispatch(fetchSchedule(selectedStudentId));
      dispatch(fetchCourses({ grade: filters.grade, semester: filters.semester, search: filters.search, page: pagination.page, size: pagination.size }));
    }
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

  if (status === 'loading' && courses.length === 0) return <LoadingSpinner message="Loading courses..." />;
  if (status === 'failed') return <ErrorAlert message={error || 'Failed to load courses'} />;

  return (
    <Box display="flex" flexDirection="column" sx={{ minHeight: 'calc(100vh - 160px)' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Course Catalog
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {pagination.totalElements} courses available
      </Typography>

      <CourseFilters
        grade={filters.grade}
        semester={filters.semester}
        search={searchText}
        onGradeChange={handleGradeChange}
        onSemesterChange={handleSemesterChange}
        onSearchChange={handleSearchChange}
        onClear={handleClearFilters}
      />

      <Box flex={1}>
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
      </Box>

      <PaginationBar
        page={pagination.page}
        totalPages={pagination.totalPages}
        pageSize={pagination.size}
        onPageChange={handlePageChange}
        onPageSizeChange={(size) => dispatch(setPageSize(size))}
      />

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
