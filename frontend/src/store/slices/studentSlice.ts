import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studentsApi } from '../../api/studentsApi';
import { StudentProfile, LoadingStatus } from '../../types';

interface StudentState {
  profile: StudentProfile | null;
  selectedStudentId: number;
  status: LoadingStatus;
  error: string | null;
}

const initialState: StudentState = {
  profile: null,
  selectedStudentId: 1, // default student
  status: 'idle',
  error: null,
};

export const fetchStudentProfile = createAsyncThunk(
  'student/fetchProfile',
  async (studentId: number) => {
    const response = await studentsApi.getProfile(studentId);
    return response.data;
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setSelectedStudentId(state, action) {
      state.selectedStudentId = action.payload;
      state.profile = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudentProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load student profile';
      });
  },
});

export const { setSelectedStudentId } = studentSlice.actions;
export default studentSlice.reducer;
