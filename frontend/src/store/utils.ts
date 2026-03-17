import { ValidationError } from '../types';

export function extractApiError(error: any): ValidationError {
  return error.response?.data ?? { type: 'other', message: 'Network error' };
}
