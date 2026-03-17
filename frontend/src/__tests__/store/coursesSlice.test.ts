import coursesReducer, {
  setFilters,
  clearFilters,
  setCoursePage,
  fetchCourses,
  fetchSections,
} from '../../store/slices/coursesSlice';
import { PaginatedResponse, Course, CourseSection } from '../../types';

const initialState = () => coursesReducer(undefined, { type: 'init' });

const mockCourse: Course = {
  id: 1, code: 'ENG101', name: 'English I', description: 'Intro',
  credits: 3, courseType: 'core', gradeLevelMin: 9, gradeLevelMax: 12,
  semesterOrder: 1, specialization: 'English', prerequisiteId: null, prerequisiteCode: null,
};

const mockPage: PaginatedResponse<Course> = {
  content: [mockCourse],
  totalElements: 1, totalPages: 1, number: 0, size: 10, first: true, last: true,
};

const mockSection: CourseSection = {
  id: 10, sectionNumber: 'A', courseId: 1, courseCode: 'ENG101', courseName: 'English I',
  teacherName: 'J. Doe', classroomName: 'Room 101', days: 'MWF',
  startTime: '08:00', endTime: '09:00', maxCapacity: 30, enrolledCount: 5,
};

const mockSectionPage: PaginatedResponse<CourseSection> = {
  content: [mockSection],
  totalElements: 1, totalPages: 1, number: 0, size: 50, first: true, last: true,
};

describe('coursesSlice reducers', () => {
  it('has correct initial state', () => {
    const state = initialState();
    expect(state.items).toEqual([]);
    expect(state.status).toBe('idle');
    expect(state.pagination.page).toBe(0);
  });

  it('setFilters updates filters and resets page', () => {
    let state = coursesReducer(initialState(), setCoursePage(3));
    state = coursesReducer(state, setFilters({ grade: 10 }));
    expect(state.filters.grade).toBe(10);
    expect(state.pagination.page).toBe(0);
  });

  it('clearFilters resets filters and page', () => {
    let state = coursesReducer(initialState(), setFilters({ grade: 11, semester: 2 }));
    state = coursesReducer(state, setCoursePage(2));
    state = coursesReducer(state, clearFilters());
    expect(state.filters).toEqual({});
    expect(state.pagination.page).toBe(0);
  });

  it('setCoursePage updates current page', () => {
    const state = coursesReducer(initialState(), setCoursePage(5));
    expect(state.pagination.page).toBe(5);
  });
});

describe('coursesSlice async thunks', () => {
  it('fetchCourses.pending sets loading status', () => {
    const state = coursesReducer(initialState(), fetchCourses.pending('', { page: 0 }));
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('fetchCourses.fulfilled populates items and pagination', () => {
    const state = coursesReducer(
      initialState(),
      fetchCourses.fulfilled(mockPage, '', { page: 0 }),
    );
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual([mockCourse]);
    expect(state.pagination.totalElements).toBe(1);
    expect(state.pagination.totalPages).toBe(1);
  });

  it('fetchCourses.rejected sets error', () => {
    const state = coursesReducer(
      initialState(),
      fetchCourses.rejected(new Error('fail'), '', { page: 0 }),
    );
    expect(state.status).toBe('failed');
    expect(state.error).toBe('fail');
  });

  it('fetchSections.pending sets sectionsStatus to loading', () => {
    const state = coursesReducer(initialState(), fetchSections.pending('', {}));
    expect(state.sectionsStatus).toBe('loading');
  });

  it('fetchSections.fulfilled populates sections and pagination', () => {
    const state = coursesReducer(
      initialState(),
      fetchSections.fulfilled(mockSectionPage, '', {}),
    );
    expect(state.sectionsStatus).toBe('succeeded');
    expect(state.sections).toEqual([mockSection]);
    expect(state.sectionsPagination.totalElements).toBe(1);
  });

  it('fetchSections.rejected sets error', () => {
    const state = coursesReducer(
      initialState(),
      fetchSections.rejected(new Error('section fail'), '', {}),
    );
    expect(state.sectionsStatus).toBe('failed');
    expect(state.error).toBe('section fail');
  });
});
