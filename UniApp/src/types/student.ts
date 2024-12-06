
export interface Program {
  id: string;
  name: string;
  facultyId: string;
  duration: number;
  degree: string;
}


export interface Faculty {
  id: string;
  name: string;
  programs?: Program[];
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

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  studentCode: string;
  facultyId: string;
  facultyName: string;
  programId: string;
  programName: string;
  academicStanding?: string;
  semester: number;
  status: 'ACTIVE' | 'SUSPENDED';
  enrollmentDate: Date | null;
  expectedGraduationDate: Date | null;
}

export interface SearchResponse {
  data: Student[];
  metadata: SearchMetadata;
}