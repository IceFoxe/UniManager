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
  Box
} from '@mui/material';

interface Grade {
  grade: number;
  course: string;
  createdAt: string;
}

const GradesComponent: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:3001/api/grades', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Session expired: Please log in again');
          }
          throw new Error('Failed to fetch grades');
        }

        const data = await response.json();
        setGrades(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
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
    <Paper sx={{ maxWidth: 800, mx: 'auto', mt: 2, p: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Student Grades
      </Typography>

      <TableContainer>
        <Table aria-label="grades table">
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle2">Course</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Grade</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Date</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.map((grade, index) => (
              <TableRow key={index} hover>
                <TableCell>{grade.course}</TableCell>
                <TableCell>{grade.grade}</TableCell>
                <TableCell>{new Date(grade.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {grades.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography color="textSecondary">
                    No grades found
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

export default GradesComponent;