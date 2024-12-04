import React, { useState, useEffect } from 'react';
import {
  Box, Paper, TextField, Button, Alert, CircularProgress,
  Typography, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Stack
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { api, SearchStudentsParams } from '../../services/api';

interface Faculty {
  id: string;
  name: string;
}

interface Student {
  id: string;
  name: string;
  surname: string;
  studentCode: string;
  faculty: string;
  course: string;
  year: number;
}

interface ErrorState {
  message: string;
  isAuth?: boolean;
}

const LIMIT_OPTIONS = [10, 25, 50, 100];

const initialSearchParams: SearchStudentsParams = {
  facultyId: '',
  page: 1,
  limit: 10
};

const StudentSearch = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [facultyError, setFacultyError] = useState<ErrorState | null>(null);
  const [searchParams, setSearchParams] = useState<SearchStudentsParams>(initialSearchParams);

  useEffect(() => {
    const loadFaculties = async () => {
      try {
        setFacultyLoading(true);
        setFacultyError(null);
        const data = await api.getFaculties();
        setFaculties(data);
      } catch (err) {
        const isAuthError = err instanceof Error && 'status' in err && err.status === 401;
        setFacultyError({
          message: isAuthError ? 'Please login to continue' : 'Failed to load faculties',
          isAuth: isAuthError
        });

        if (isAuthError) {
          window.location.href = '/login';
        }
      } finally {
        setFacultyLoading(false);
      }
    };

    loadFaculties();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.searchStudents(searchParams);
      setStudents(result.data);
    } catch (err) {
      const isAuthError = err instanceof Error && 'status' in err && err.status === 401;
      setError({
        message: isAuthError ? 'Please login to continue' : 'Failed to search students',
        isAuth: isAuthError
      });

      if (isAuthError) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SearchStudentsParams) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchParams(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field: keyof SearchStudentsParams) => (
    event: SelectChangeEvent<string | number>
  ) => {
    setSearchParams(prev => ({ ...prev, [field]: event.target.value }));
  };

  const renderError = (error: ErrorState) => (
    <Alert
      severity={error.isAuth ? "warning" : "error"}
      action={error.isAuth && (
        <Button color="inherit" size="small" href="/login">
          Login
        </Button>
      )}
    >
      {error.message}
    </Alert>
  );

  return (
    <Paper sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Student Search
      </Typography>

      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth error={Boolean(facultyError)}>
            <InputLabel>Faculty</InputLabel>
            <Select
              value={searchParams.facultyId}
              label="Faculty"
              onChange={handleSelectChange('facultyId')}
              disabled={facultyLoading}
            >
              {facultyLoading ? (
                <MenuItem disabled>Loading faculties...</MenuItem>
              ) : faculties.map(faculty => (
                <MenuItem key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Name"
            onChange={handleInputChange('name')}
          />

          <TextField
            fullWidth
            label="Surname"
            onChange={handleInputChange('surname')}
          />

          <TextField
            fullWidth
            label="Student Code"
            onChange={handleInputChange('studentCode')}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="Course"
            onChange={handleInputChange('course')}
          />

          <FormControl fullWidth>
            <InputLabel>Results per page</InputLabel>
            <Select
              value={searchParams.limit}
              label="Results per page"
              onChange={handleSelectChange('limit')}
            >
              {LIMIT_OPTIONS.map(limit => (
                <MenuItem key={limit} value={limit}>
                  {limit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {facultyError && renderError(facultyError)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading || facultyLoading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            Search
          </Button>
        </Box>

        {error && renderError(error)}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Surname</TableCell>
                <TableCell>Faculty</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Year</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.studentCode}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.surname}</TableCell>
                  <TableCell>{student.faculty}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>{student.year}</TableCell>
                </TableRow>
              ))}
              {!loading && students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Paper>
  );
};

export default StudentSearch;