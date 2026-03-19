import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { coursesApi } from '../../api/coursesApi';
import { Course, CourseSection, LoadingStatus, PaginatedResponse } from '../../types';

interface CoursesState {
  items: Course[];
  sections: CourseSection[];
  filters: {
    grade?: number;
    semester?: number;
    search?: string;
  };
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
  sectionsPagination: {
    page: number;
    totalPages: number;
    totalElements: number;
  };
  status: LoadingStatus;
  sectionsStatus: LoadingStatus;
  error: string | null;
}

const initialState: CoursesState = {
  items: [],
  sections: [],
  filters: {},
  pagination: { page: 0, size: 12, totalPages: 0, totalElements: 0 },
  sectionsPagination: { page: 0, totalPages: 0, totalElements: 0 },
  status: 'idle',
  sectionsStatus: 'idle',
  error: null,
};

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async ({ grade, semester, search, page = 0, size = 12 }: {
    grade?: number; semester?: number; search?: string; page?: number; size?: number;
  }) => {
    const response = await coursesApi.getAll(grade, semester, search, page, size);
    return response.data;
  }
);

export const fetchSections = createAsyncThunk(
  'courses/fetchSections',
  async ({ courseId, page = 0, size = 50 }: {
    courseId?: number; page?: number; size?: number;
  }) => {
    const response = await coursesApi.getSections(courseId, page, size);
    return response.data;
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<{ grade?: number; semester?: number; search?: string }>) {
      state.filters = action.payload;
      state.pagination.page = 0;
    },
    clearFilters(state) {
      state.filters = {};
      state.pagination.page = 0;
    },
    setCoursePage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pagination.size = action.payload;
      state.pagination.page = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCourses
      .addCase(fetchCourses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<PaginatedResponse<Course>>) => {
        state.status = 'succeeded';
        state.items = action.payload.content;
        state.pagination = {
          ...state.pagination,
          page: action.payload.number,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
        };
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load courses';
      })
      // fetchSections
      .addCase(fetchSections.pending, (state) => {
        state.sectionsStatus = 'loading';
      })
      .addCase(fetchSections.fulfilled, (state, action: PayloadAction<PaginatedResponse<CourseSection>>) => {
        state.sectionsStatus = 'succeeded';
        state.sections = action.payload.content;
        state.sectionsPagination = {
          page: action.payload.number,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
        };
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.sectionsStatus = 'failed';
        state.error = action.error.message || 'Failed to load sections';
      });
  },
});

export const { setFilters, clearFilters, setCoursePage, setPageSize } = coursesSlice.actions;
export default coursesSlice.reducer;
