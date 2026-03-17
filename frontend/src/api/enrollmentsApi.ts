import { apiClient } from './apiClient';
import { EnrollmentRequest, EnrollmentResponse } from '../types';

export const enrollmentsApi = {
  enroll: (request: EnrollmentRequest) =>
    apiClient.post<EnrollmentResponse>('/enrollments', request),

  drop: (enrollmentId: number) =>
    apiClient.delete(`/enrollments/${enrollmentId}`),
};
