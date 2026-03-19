import { apiClient } from './apiClient';
import { Course, CourseSection, PaginatedResponse } from '../types';

export const coursesApi = {
  getAll: (grade?: number, semester?: number, search?: string, page = 0, size = 10) => {
    const params: Record<string, string | number> = { page, size };

    if (grade !== undefined) {
      params.grade = grade;
    }

    if (semester !== undefined) {
      params.semester = semester;
    }

    if (search) {
      params.search = search;
    }

    return apiClient.get<PaginatedResponse<Course>>('/courses', { params });
  },

  getById: (id: number) =>
    apiClient.get<Course>(`/courses/${id}`),

  getSections: (courseId?: number, page = 0, size = 10) => {
    const params: Record<string, number> = { page, size };
    if (courseId !== undefined) params.courseId = courseId;
    return apiClient.get<PaginatedResponse<CourseSection>>('/courses/sections', { params });
  },
};
