// services/api.ts
const API_BASE_URL = 'http://localhost:3001/api';

const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
});



export interface SearchStudentsParams {
  facultyId: string;
  name?: string;
  surname?: string;
  studentCode?: string;
  course?: string;
  year?: number;
  page?: number;
  limit: number;
}

export const api = {
  async getFaculties() {
    const response = await fetch(`${API_BASE_URL}/Faculties`, {
      headers: getHeaders()
    });

    if (response.status === 401) {
      throw Object.assign(new Error('Unauthorized'), { status: 401 });
    }

    if (!response.ok) {
      throw Object.assign(new Error('Failed to fetch faculties'), { status: response.status });
    }

    return response.json();
  },

  async searchStudents(params: SearchStudentsParams) {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => [key, String(value)])
    );

    const response = await fetch(`${API_BASE_URL}/students/search?${queryString}`, {
      headers: getHeaders()
    });

    if (response.status === 401) {
      throw Object.assign(new Error('Unauthorized'), { status: 401 });
    }

    if (!response.ok) {
      throw Object.assign(new Error('Network response was not ok'), { status: response.status });
    }

    return response.json();
  }
};