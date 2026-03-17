import studentReducer, {
  setSelectedStudentId,
  fetchStudentProfile,
} from '../../store/slices/studentSlice';
import { StudentProfile } from '../../types';

const initialState = () => studentReducer(undefined, { type: 'init' });

const profile: StudentProfile = {
  id: 1, firstName: 'Alice', lastName: 'Smith',
  email: 'alice@school.edu', gradeLevel: 10,
  enrollmentYear: 2023, expectedGraduationYear: 2027,
  gpa: 3.5, creditsEarned: 18, creditsRequired: 60,
  courseHistory: [
    { courseId: 1, courseCode: 'ENG101', courseName: 'English I', credits: 3, semesterName: 'Fall 2023', status: 'passed' },
    { courseId: 2, courseCode: 'MATH101', courseName: 'Algebra I', credits: 3, semesterName: 'Fall 2023', status: 'failed' },
  ],
};

const stateWithProfile = () =>
  studentReducer(initialState(), fetchStudentProfile.fulfilled(profile, '', 1));

describe('studentSlice reducers', () => {
  it('has correct initial state with default student id 1', () => {
    const state = initialState();
    expect(state.selectedStudentId).toBe(1);
    expect(state.profile).toBeNull();
    expect(state.status).toBe('idle');
  });

  it('setSelectedStudentId updates id and resets profile', () => {
    const state = studentReducer(stateWithProfile(), setSelectedStudentId(5));
    expect(state.selectedStudentId).toBe(5);
    expect(state.profile).toBeNull();
    expect(state.status).toBe('idle');
  });
});

describe('fetchStudentProfile thunk', () => {
  it('pending sets loading', () => {
    const state = studentReducer(initialState(), fetchStudentProfile.pending('', 1));
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('fulfilled stores the profile', () => {
    const state = stateWithProfile();
    expect(state.status).toBe('succeeded');
    expect(state.profile).toEqual(profile);
    expect(state.profile!.courseHistory).toHaveLength(2);
  });

  it('rejected sets error', () => {
    const state = studentReducer(
      initialState(),
      fetchStudentProfile.rejected(new Error('Student not found'), '', 1),
    );
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Student not found');
  });
});
