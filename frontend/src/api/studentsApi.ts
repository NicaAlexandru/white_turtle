import { apiClient } from './apiClient';
import { StudentProfile, Schedule } from '../types';

export const studentsApi = {
  getProfile: (id: number) =>
    apiClient.get<StudentProfile>(`/students/${id}`),

  getSchedule: (id: number) =>
    apiClient.get<Schedule>(`/students/${id}/schedule`),
};
