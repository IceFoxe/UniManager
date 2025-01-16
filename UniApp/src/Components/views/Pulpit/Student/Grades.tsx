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
  courseName: string;
  value: number;
  course_id: string;
  createdAt: string;
  date: Date;
}

interface AuthUser {
  entity_id: string;
  token: string;
}

const GradesComponent: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const userDataStr = localStorage.getItem('user');

        if (!authToken || !userDataStr) {
          throw new Error('No authentication data found');
        }

        const userData = JSON.parse(userDataStr) as AuthUser;

        const response = await fetch(`http://localhost:3001/api/grades/student/${userData.entity_id}`, {
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
        console.log(data);
        setGrades(data.data);
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
    <Paper sx={{ mx: 'auto', mt: 2, p: 2, background: '#151515', boxShadow: '0', border: '1px solid rgba(255,255,255,0.1)' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Oceny studenta
      </Typography>

      <TableContainer>
        <Table aria-label="grades table">
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle2">Kurs</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Ocena</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Data wystawienia</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.map((grade, index) => (
              <TableRow key={index} hover>
                <TableCell>{grade.courseName}</TableCell>
                <TableCell>{grade.value}</TableCell>
                <TableCell>{new Date(grade.date).toLocaleDateString()}</TableCell>
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