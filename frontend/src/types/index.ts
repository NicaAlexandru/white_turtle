// ---- Pagination ----

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page (0-based)
  size: number;
  first: boolean;
  last: boolean;
}

// ---- Course ----

export interface Course {
  id: number;
  code: string;
  name: string;
  description: string;
  credits: number;
  courseType: 'core' | 'elective';
  gradeLevelMin: number;
  gradeLevelMax: number;
  semesterOrder: number;
  specialization: string;
  prerequisiteId: number | null;
  prerequisiteCode: string | null;
}

// ---- Course Section ----

export interface CourseSection {
  id: number;
  sectionNumber: string;
  courseId: number;
  courseCode: string;
  courseName: string;
  teacherName: string;
  classroomName: string;
  days: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  enrolledCount: number;
}

// ---- Student ----

export interface CourseHistory {
  courseId: number;
  courseCode: string;
  courseName: string;
  credits: number;
  semesterName: string;
  status: 'passed' | 'failed';
}

export interface StudentProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gradeLevel: number;
  enrollmentYear: number;
  expectedGraduationYear: number;
  gpa: number;
  creditsEarned: number;
  creditsRequired: number;
  courseHistory: CourseHistory[];
}

// ---- Schedule ----

export interface ScheduleEntry {
  enrollmentId: number;
  sectionId: number;
  courseId: number;
  courseCode: string;
  courseName: string;
  credits: number;
  teacherName: string;
  classroomName: string;
  days: string;
  startTime: string;
  endTime: string;
  enrolledAt: string;
}

export interface Schedule {
  studentId: number;
  studentName: string;
  semesterName: string;
  courseCount: number;
  entries: ScheduleEntry[];
}

// ---- Enrollment ----

export interface EnrollmentRequest {
  studentId: number;
  sectionId: number;
}

export interface EnrollmentResponse {
  enrollmentId: number;
  message: string;
  scheduleEntry: ScheduleEntry;
}

// ---- Errors ----

export interface ValidationError {
  type: 'prerequisite' | 'conflict' | 'max_courses' | 'grade_level' | 'capacity' | 'duplicate' | 'not_found' | 'validation' | 'other';
  message: string;
}

// ---- State helpers ----

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
