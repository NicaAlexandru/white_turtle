import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studentsApi } from '../../api/studentsApi';
import { enrollmentsApi } from '../../api/enrollmentsApi';
import { Schedule, ValidationError, LoadingStatus, EnrollmentRequest } from '../../types';
import { extractApiError } from '../utils';

interface ScheduleState {
  schedule: Schedule | null;
  status: LoadingStatus;
  enrolling: boolean;
  dropping: boolean;
  error: string | null;
  validationError: ValidationError | null;
  successMessage: string | null;
}

const initialState: ScheduleState = {
  schedule: null,
  status: 'idle',
  enrolling: false,
  dropping: false,
  error: null,
  validationError: null,
  successMessage: null,
};

export const fetchSchedule = createAsyncThunk(
  'schedule/fetchSchedule',
  async (studentId: number) => {
    const response = await studentsApi.getSchedule(studentId);
    return response.data;
  }
);

export const enrollInSection = createAsyncThunk(
  'schedule/enroll',
  async (request: EnrollmentRequest, { rejectWithValue }) => {
    try {
      const response = await enrollmentsApi.enroll(request);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

export const dropEnrollment = createAsyncThunk(
  'schedule/drop',
  async (enrollmentId: number, { rejectWithValue }) => {
    try {
      await enrollmentsApi.drop(enrollmentId);
      return enrollmentId;
    } catch (error: any) {
      return rejectWithValue(extractApiError(error));
    }
  }
);

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    clearValidationError(state) {
      state.validationError = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSchedule
      .addCase(fetchSchedule.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schedule = action.payload;
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load schedule';
      })
      // enrollInSection
      .addCase(enrollInSection.pending, (state) => {
        state.enrolling = true;
        state.validationError = null;
        state.successMessage = null;
      })
      .addCase(enrollInSection.fulfilled, (state, action) => {
        state.enrolling = false;
        state.successMessage = action.payload.message;
        if (state.schedule) {
          state.schedule.entries.push(action.payload.scheduleEntry);
          state.schedule.courseCount = state.schedule.entries.length;
        }
      })
      .addCase(enrollInSection.rejected, (state, action) => {
        state.enrolling = false;
        state.validationError = action.payload as ValidationError;
      })
      // dropEnrollment
      .addCase(dropEnrollment.pending, (state) => {
        state.dropping = true;
        state.validationError = null;
        state.successMessage = null;
      })
      .addCase(dropEnrollment.fulfilled, (state, action) => {
        state.dropping = false;
        state.successMessage = 'Course dropped successfully';
        if (state.schedule) {
          state.schedule.entries = state.schedule.entries.filter(
            (e) => e.enrollmentId !== action.payload
          );
          state.schedule.courseCount = state.schedule.entries.length;
        }
      })
      .addCase(dropEnrollment.rejected, (state, action) => {
        state.dropping = false;
        state.validationError = action.payload as ValidationError;
      });
  },
});

export const { clearValidationError, clearSuccessMessage } = scheduleSlice.actions;
export default scheduleSlice.reducer;
