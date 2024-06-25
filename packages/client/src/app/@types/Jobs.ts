import type { User } from './User';

export interface JobsApplications {
  createdAt: Date;
  id: string;
  jobId: string;
  status: string;
  updatedAt: Date;
  user: User;
}

export interface Jobs {
  application: JobsApplications | null;
  archived: boolean;
  company: string | null;
  createdAt: Date;
  createdBy: User;
  datePosted: Date | null;
  description: string | null;
  experienceLevel: string;
  id: string;
  location: string | null;
  payMax: number | null;
  payMin: number | null;
  payType: string | null;
  remoteStatus: string;
  title: string;
  type: string;
  updatedAt: Date;
  url: string;
}
