export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum Status {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export interface SupportRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: Priority;
  status: Status;
  created_at: string;
  updated_at?: string;
}

export interface CreateSupportRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority?: Priority;
}

export interface UpdateSupportRequest {
  subject?: string;
  message?: string;
  priority?: Priority;
  status?: Status;
}

export interface SupportResponse {
  id: string;
  status: string;
  message: string;
} 