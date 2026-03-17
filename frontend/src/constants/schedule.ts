export const MAX_COURSES_PER_SEMESTER = 5;

export const TIME_SLOTS = [
  { label: '8:00 - 9:00', start: '08:00', end: '09:00' },
  { label: '9:00 - 10:00', start: '09:00', end: '10:00' },
  { label: '10:00 - 11:00', start: '10:00', end: '11:00' },
  { label: '11:00 - 12:00', start: '11:00', end: '12:00' },
  { label: '12:00 - 1:00', start: '12:00', end: '13:00' },
  { label: '1:00 - 2:00', start: '13:00', end: '14:00' },
  { label: '2:00 - 3:00', start: '14:00', end: '15:00' },
  { label: '3:00 - 4:00', start: '15:00', end: '16:00' },
] as const;

export const DAY_COLUMNS = [
  { label: 'Monday', key: 'M' },
  { label: 'Tuesday', key: 'T' },
  { label: 'Wednesday', key: 'W' },
  { label: 'Thursday', key: 'H' },
  { label: 'Friday', key: 'F' },
] as const;

export const COURSE_COLORS = [
  '#1976d2',
  '#388e3c',
  '#f57c00',
  '#7b1fa2',
  '#c62828',
  '#00838f',
  '#4e342e',
  '#283593',
] as const;

export const LUNCH_START_TIME = '12:00';
