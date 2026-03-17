import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from './slices/coursesSlice';
import studentReducer from './slices/studentSlice';
import scheduleReducer from './slices/scheduleSlice';

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    student: studentReducer,
    schedule: scheduleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
