// types/student.ts
export interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  facultyName: string;
  programName: string;
  academicStanding: string;
  enrollmentStatus: string;
  advisor?: string;
}

export interface Faculty {
  id: string;
  name: string;
}

export interface SearchParams {
  name: string;
  facultyId: string;
  studentCode: string;
  page: number;
  limit: number;
}

export interface SearchMetadata {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface SearchResponse {
  data: Student[];
  metadata: SearchMetadata;
}