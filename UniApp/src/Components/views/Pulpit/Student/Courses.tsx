import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Chip
} from '@mui/material';

interface Course {
  id: number;
  name: string;
  code: string;
  credits: number;
  semester: number;
  mandatory: boolean;
  programName: string;
  teacherName: string;
}

interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CoursesResponse {
  data: Course[];
  metadata: PaginationMetadata;
}

interface AuthUser {
  entity_id: string;
  token: string;
}

const CoursesComponent: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const userDataStr = localStorage.getItem('user');

        if (!authToken || !userDataStr) {
          throw new Error('No authentication data found');
        }

        const userData = JSON.parse(userDataStr) as AuthUser;

        const response = await fetch(`http://localhost:3001/api/courses/student/${userData.entity_id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Session expired: Please log in again');
          }
          throw new Error('Failed to fetch courses');
        }

        const { data } = (await response.json()) as CoursesResponse;
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ mx: 'auto', mt: 2, p: 2, background: '#151515', boxShadow: '0', border: '1px solid rgba(255,255,255,0.1)' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Kursy studenta
      </Typography>

      <TableContainer>
        <Table aria-label="courses table">
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle2">Nazwa</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Kod</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">ECTS</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Semestr</Typography></TableCell>

              <TableCell><Typography variant="subtitle2">Prowadzący</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Status</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id} hover>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.code}</TableCell>
                <TableCell>{course.credits}</TableCell>
                <TableCell>{course.semester}</TableCell>
                <TableCell>{course.teacherName}</TableCell>
                <TableCell>
                  <Chip
                    label={course.mandatory ? "Obowiązkowy" : "Fakultatywny"}
                    color={course.mandatory ? "error" : "success"}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
            {courses.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">
                    No courses found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CoursesComponent;