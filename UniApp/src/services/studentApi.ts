import {SearchParams, SearchResponse, Student, Program, StudentCreate} from '../types/student';

const API_BASE_URL = 'http://localhost:3001/api';

const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
});

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.json();
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
    console.log(`${API_BASE_URL}/students?${queryParams}`);
    const response = await fetch(`${API_BASE_URL}/students/search?${queryParams}`, {
      method: 'GET',
      headers: getHeaders()
    });

    return handleResponse<SearchResponse>(response);
  },

  async getFaculties(){
    const response = await fetch(`${API_BASE_URL}/faculties`, {
      method: 'GET',
      headers: getHeaders(),
    });

    return response.json();
  },

  async getStudentById(id: string) {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return response.json();
  },

  async getProgramsByFaculty(facultyId: string) {
    const response = await fetch(`${API_BASE_URL}/faculties/${facultyId}/programs`, {
      method: 'GET',
      headers: getHeaders()
    });

    return response.json();
  },

  async getProgramById(programId: string): Promise<Program> {
    const response = await fetch(`${API_BASE_URL}/programs/${programId}`, {
      method: 'GET',
      headers: getHeaders()
    });

    return response.json();
  },

  async createStudent(data: StudentCreate) {
    const response = await fetch(`${API_BASE_URL}/students/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
        student_number: data.studentCode,
        program_id: data.programId,
        semester: data.semester,
        status: data.status,
        enrollment_date: data.enrollmentDate,
        expected_graduation: data.expectedGraduationDate
      })
    });

  return response.json();
  },

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students/sudoupdate/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        first_name: data.fullName,
        last_name: data.fullName,
        student_number: data.studentCode,
        program_id: data.programId,
        status: data.status,
      })
    });
    console.log(JSON.stringify({
        first_name: data.fullName,
        last_name: data.fullName,
        student_number: data.studentCode,
        program_id: data.programId,
        status: data.status,
      }));
    console.log(response.json());

    return response.json();
  }
};

export default studentApi;