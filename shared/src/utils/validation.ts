import { Priority, CreateSupportRequest } from '../types/support';

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPriority(priority: string): priority is Priority {
  return Object.values(Priority).includes(priority as Priority);
}

export function validateSupportRequest(request: CreateSupportRequest): string[] {
  const errors: string[] = [];

  if (!request.name || request.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!request.email || !isValidEmail(request.email)) {
    errors.push('Please provide a valid email address');
  }

  if (!request.subject || request.subject.trim().length < 5) {
    errors.push('Subject must be at least 5 characters long');
  }

  if (!request.message || request.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  }

  if (request.priority && !isValidPriority(request.priority)) {
    errors.push('Invalid priority level');
  }

  return errors;
} 