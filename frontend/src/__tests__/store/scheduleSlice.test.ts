import scheduleReducer, {
  clearValidationError,
  clearSuccessMessage,
  fetchSchedule,
  enrollInSection,
  dropEnrollment,
} from '../../store/slices/scheduleSlice';
import { Schedule, ScheduleEntry, EnrollmentResponse, ValidationError } from '../../types';

const initialState = () => scheduleReducer(undefined, { type: 'init' });

const entry: ScheduleEntry = {
  enrollmentId: 1, sectionId: 10, courseId: 100,
  courseCode: 'ENG101', courseName: 'English I',
  teacherName: 'J. Doe', classroomName: 'Room 101',
  days: 'MWF', startTime: '08:00', endTime: '09:00',
  enrolledAt: '2024-09-01T10:00:00',
};

const schedule: Schedule = {
  studentId: 1, studentName: 'Alice Smith', semesterName: 'Fall 2024',
  courseCount: 1, entries: [entry],
};

const stateWithValidationError = () => {
  const err: ValidationError = { type: 'conflict', message: 'Time conflict' };
  return scheduleReducer(
    initialState(),
    enrollInSection.rejected(null, '', { studentId: 1, sectionId: 1 }, err),
  );
};

const stateWithSchedule = (s: Schedule = schedule) =>
  scheduleReducer(initialState(), fetchSchedule.fulfilled(s, '', 1));

describe('scheduleSlice reducers', () => {
  it('clearValidationError resets the error', () => {
    const state = scheduleReducer(stateWithValidationError(), clearValidationError());
    expect(state.validationError).toBeNull();
  });

  it('clearSuccessMessage resets the message', () => {
    let state = stateWithSchedule();
    state = scheduleReducer(state, dropEnrollment.fulfilled(entry.enrollmentId, '', 1));
    state = scheduleReducer(state, clearSuccessMessage());
    expect(state.successMessage).toBeNull();
  });
});

describe('fetchSchedule thunk', () => {
  it('pending sets loading', () => {
    const state = scheduleReducer(initialState(), fetchSchedule.pending('', 1));
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('fulfilled stores the schedule', () => {
    const state = stateWithSchedule();
    expect(state.status).toBe('succeeded');
    expect(state.schedule).toEqual(schedule);
  });

  it('rejected sets error message', () => {
    const state = scheduleReducer(
      initialState(),
      fetchSchedule.rejected(new Error('not found'), '', 1),
    );
    expect(state.status).toBe('failed');
    expect(state.error).toBe('not found');
  });
});

describe('enrollInSection thunk', () => {
  it('pending sets enrolling flag and clears messages', () => {
    const state = scheduleReducer(
      initialState(),
      enrollInSection.pending('', { studentId: 1, sectionId: 10 }),
    );
    expect(state.enrolling).toBe(true);
    expect(state.validationError).toBeNull();
    expect(state.successMessage).toBeNull();
  });

  it('fulfilled adds entry to schedule and sets success message', () => {
    const emptySchedule: Schedule = { ...schedule, entries: [], courseCount: 0 };
    let state = stateWithSchedule(emptySchedule);

    const response: EnrollmentResponse = {
      enrollmentId: 2, message: 'Enrolled successfully', scheduleEntry: entry,
    };
    state = scheduleReducer(
      state,
      enrollInSection.fulfilled(response, '', { studentId: 1, sectionId: 10 }),
    );
    expect(state.enrolling).toBe(false);
    expect(state.successMessage).toBe('Enrolled successfully');
    expect(state.schedule!.entries).toHaveLength(1);
    expect(state.schedule!.courseCount).toBe(1);
  });

  it('rejected stores validation error', () => {
    const validationError: ValidationError = { type: 'prerequisite', message: 'Missing prereq' };
    const state = scheduleReducer(
      initialState(),
      enrollInSection.rejected(null, '', { studentId: 1, sectionId: 10 }, validationError),
    );
    expect(state.enrolling).toBe(false);
    expect(state.validationError).toEqual(validationError);
  });
});

describe('dropEnrollment thunk', () => {
  it('pending sets dropping flag', () => {
    const state = scheduleReducer(initialState(), dropEnrollment.pending('', 1));
    expect(state.dropping).toBe(true);
    expect(state.validationError).toBeNull();
  });

  it('fulfilled removes entry and updates count', () => {
    let state = stateWithSchedule();
    state = scheduleReducer(state, dropEnrollment.fulfilled(entry.enrollmentId, '', 1));
    expect(state.dropping).toBe(false);
    expect(state.successMessage).toBe('Course dropped successfully');
    expect(state.schedule!.entries).toHaveLength(0);
    expect(state.schedule!.courseCount).toBe(0);
  });

  it('rejected stores validation error', () => {
    const error: ValidationError = { type: 'not_found', message: 'Not found' };
    const state = scheduleReducer(
      initialState(),
      dropEnrollment.rejected(null, '', 1, error),
    );
    expect(state.dropping).toBe(false);
    expect(state.validationError).toEqual(error);
  });
});
