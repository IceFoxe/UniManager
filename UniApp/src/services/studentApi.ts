import { Faculty, SearchParams, SearchResponse, Student, Program } from '../types/student';

const API_BASE_URL = 'http://localhost:3001/api';

const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
});

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }

  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error('Failed to parse response:', text);
    throw new Error('Invalid JSON response from server');
  }
};

const studentApi = {
  async searchStudents(params: SearchParams): Promise<SearchResponse> {
    const queryParams = new URLSearchParams({
      ...params,
      page: params.page.toString(),
      limit: params.limit.toString()
    });

    const response = await fetch(`${API_BASE_URL}/students?${queryParams}`, {
      method: 'GET',
      headers: getHeaders()
    });

    return handleResponse<SearchResponse>(response);
  },

  async getFaculties(): Promise<Faculty[]> {
    const response = await fetch(`${API_BASE_URL}/faculties`, {
      method: 'GET',
      headers: getHeaders(),
    });

    return handleResponse<Faculty[]>(response);
  },

  async getStudentById(id: string): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });

    return handleResponse<Student>(response);
  },

  async getProgramsByFaculty(facultyId: string): Promise<Program[]> {
    const response = await fetch(`${API_BASE_URL}/Faculties/${facultyId}/programs`, {
      method: 'GET',
      headers: getHeaders()
    });

    return handleResponse<Program[]>(response);
  },

  async getProgramById(programId: string): Promise<Program> {
    const response = await fetch(`${API_BASE_URL}/programs/${programId}`, {
      method: 'GET',
      headers: getHeaders()
    });

    return handleResponse<Program>(response);
  },

  async createStudent(data: Omit<Student, 'id' | 'fullName' | 'facultyName' | 'programName'>): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });

    return handleResponse<Student>(response);
  },

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });

    return handleResponse<Student>(response);
  }
};

export default studentApi;